# Deployment Guide

This guide covers deploying the Quiz Application to production environments.

## Prerequisites

- Production PostgreSQL database
- Java 17+ runtime environment
- Node.js 16+ (for building frontend)
- Web server (e.g., Nginx, Apache) or cloud platform

## Option 1: Traditional Server Deployment

### Backend Deployment

1. **Build the application**
   ```bash
   cd backend
   mvn clean package -DskipTests
   ```
   This creates a JAR file in `target/quiz-app-1.0.0.jar`

2. **Configure production settings**
   
   Set environment variables:
   ```bash
   export DB_USERNAME=your_db_user
   export DB_PASSWORD=your_db_password
   export SPRING_PROFILES_ACTIVE=prod
   ```

3. **Run the application**
   ```bash
   java -jar target/quiz-app-1.0.0.jar --spring.profiles.active=prod
   ```

4. **Run as a service (Linux)**
   
   Create `/etc/systemd/system/quiz-app.service`:
   ```ini
   [Unit]
   Description=Quiz Application
   After=syslog.target network.target

   [Service]
   User=quiz
   ExecStart=/usr/bin/java -jar /opt/quiz-app/quiz-app-1.0.0.jar
   SuccessExitStatus=143
   Environment="SPRING_PROFILES_ACTIVE=prod"
   Environment="DB_USERNAME=your_db_user"
   Environment="DB_PASSWORD=your_db_password"

   [Install]
   WantedBy=multi-user.target
   ```

   Enable and start:
   ```bash
   sudo systemctl enable quiz-app
   sudo systemctl start quiz-app
   sudo systemctl status quiz-app
   ```

### Frontend Deployment

1. **Update API URL**
   
   Create `frontend/.env.production`:
   ```env
   REACT_APP_API_BASE_URL=https://your-api-domain.com/api/quiz
   ```

2. **Build the application**
   ```bash
   cd frontend
   npm install
   npm run build
   ```
   This creates optimized files in `build/` directory

3. **Deploy with Nginx**
   
   Copy build files:
   ```bash
   sudo cp -r build/* /var/www/quiz-app/
   ```

   Nginx configuration `/etc/nginx/sites-available/quiz-app`:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/quiz-app;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       location /api {
           proxy_pass http://localhost:8080;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

   Enable site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/quiz-app /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

## Option 2: Docker Deployment

### Backend Dockerfile

Create `backend/Dockerfile`:
```dockerfile
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN apk add --no-cache maven
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/quiz-app-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Frontend Dockerfile

Create `frontend/Dockerfile`:
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Create `frontend/nginx.conf`:
```nginx
server {
    listen 80;
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
```

### Docker Compose

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: quizdb
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/quizdb
      SPRING_DATASOURCE_USERNAME: postgres
      SPRING_DATASOURCE_PASSWORD: ${DB_PASSWORD}
      SPRING_PROFILES_ACTIVE: prod
    depends_on:
      postgres:
        condition: service_healthy
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  postgres-data:
```

Run with:
```bash
DB_PASSWORD=your_secure_password docker-compose up -d
```

## Option 3: Cloud Platform Deployment

### Heroku

**Backend:**
1. Create `backend/system.properties`:
   ```properties
   java.runtime.version=17
   ```

2. Create `backend/Procfile`:
   ```
   web: java -jar target/quiz-app-1.0.0.jar --server.port=$PORT
   ```

3. Deploy:
   ```bash
   heroku create quiz-app-backend
   heroku addons:create heroku-postgresql:hobby-dev
   git subtree push --prefix backend heroku master
   ```

**Frontend:**
1. Update API URL in `.env.production`
2. Deploy to Netlify, Vercel, or Heroku

### AWS

**Backend (Elastic Beanstalk):**
1. Package application: `mvn clean package`
2. Upload JAR to Elastic Beanstalk
3. Configure environment variables
4. Set up RDS PostgreSQL instance

**Frontend (S3 + CloudFront):**
1. Build: `npm run build`
2. Upload to S3 bucket
3. Configure CloudFront distribution
4. Set up custom domain

### Google Cloud Platform

**Backend (Cloud Run):**
```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/quiz-backend
gcloud run deploy quiz-backend --image gcr.io/PROJECT_ID/quiz-backend --platform managed
```

**Frontend (Firebase Hosting):**
```bash
npm install -g firebase-tools
firebase init hosting
firebase deploy
```

## Database Migration

For production, use Flyway or Liquibase for database migrations.

Add to `pom.xml`:
```xml
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
```

Create migration files in `src/main/resources/db/migration/`

## Security Considerations

1. **Environment Variables**: Never commit credentials
2. **HTTPS**: Use SSL/TLS certificates (Let's Encrypt)
3. **Database**: Use strong passwords, restrict network access
4. **CORS**: Update `CorsConfig.java` with production URLs
5. **Rate Limiting**: Implement API rate limiting
6. **Input Validation**: Already implemented in DTOs
7. **SQL Injection**: Protected by JPA/Hibernate

## Monitoring

### Application Monitoring

Add Spring Boot Actuator to `pom.xml`:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

Enable in `application-prod.properties`:
```properties
management.endpoints.web.exposure.include=health,info,metrics
management.endpoint.health.show-details=always
```

### Log Aggregation

- Use ELK Stack (Elasticsearch, Logstash, Kibana)
- Or cloud services: AWS CloudWatch, Google Cloud Logging

## Performance Optimization

1. **Database Connection Pooling** (already configured)
2. **Caching**: Add Redis for leaderboard caching
3. **CDN**: Use CDN for frontend static assets
4. **Compression**: Enable gzip compression in Nginx
5. **Database Indexing**: Add indexes on frequently queried columns

## Backup Strategy

1. **Database Backup**
   ```bash
   pg_dump -U postgres quizdb > backup_$(date +%Y%m%d).sql
   ```

2. **Automated Backups**
   - Use PostgreSQL replication
   - Or cloud provider backup services (RDS automated backups, Cloud SQL backups)

## Rollback Procedure

1. Keep previous JAR file version
2. Restore database from backup if needed
3. Redeploy previous version:
   ```bash
   sudo systemctl stop quiz-app
   cp quiz-app-1.0.0-backup.jar quiz-app-1.0.0.jar
   sudo systemctl start quiz-app
   ```

## Health Checks

Backend health endpoint: `GET /actuator/health`

Frontend health check: Ensure index.html is accessible

## SSL/TLS Setup (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

Auto-renewal is configured automatically by certbot.

## Post-Deployment Checklist

- [ ] Database is accessible and populated
- [ ] Backend API endpoints respond correctly
- [ ] Frontend loads and connects to backend
- [ ] HTTPS is enabled
- [ ] CORS is configured correctly
- [ ] Environment variables are set
- [ ] Logging is working
- [ ] Monitoring is active
- [ ] Backups are configured
- [ ] Health checks pass
- [ ] Performance is acceptable

## Troubleshooting Production Issues

1. **Check logs**: `journalctl -u quiz-app -f`
2. **Database connection**: Verify credentials and network access
3. **CORS errors**: Update allowed origins
4. **502 errors**: Check if backend is running
5. **Slow performance**: Check database queries and add indexes

## Scaling

### Horizontal Scaling
- Deploy multiple backend instances
- Use load balancer (Nginx, HAProxy, AWS ALB)
- Use read replicas for database

### Vertical Scaling
- Increase server resources (CPU, RAM)
- Optimize database configuration
- Use caching (Redis, Memcached)

## Cost Optimization

- Use cloud free tiers initially
- Scale based on actual usage
- Implement auto-scaling
- Use spot instances for non-critical services
- Optimize database queries to reduce load
