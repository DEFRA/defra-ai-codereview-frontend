# Architecture Overview

This document outlines the architecture of the Defra AI Code Review Frontend application.

## System Context

The application is a web-based frontend service that provides interfaces for AI-powered code reviews and standards management. It integrates with a backend API service for processing code reviews and managing development standards.

```mermaid
graph TB
    User((User))-->Frontend[Frontend Service]
    Frontend-->API[Code Review API]
    Frontend-->Redis[(Redis Cache)]
    API-->Queue[(Review Queue)]
    API-->Standards[(Standards DB)]

    subgraph Infrastructure
        Frontend
        Redis
    end

    subgraph External Services
        API
        Queue
        Standards
    end
```

## Data Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API
    participant R as Redis
    participant S as Standards DB

    %% Code Review Flow
    U->>F: Submit Repository
    F->>A: Create Review Request
    A-->>F: Review ID
    F->>R: Cache Review Status

    loop Status Check
        U->>F: Check Status
        F->>R: Get Cached Status
        alt Cache Miss
            F->>A: Get Status
            A-->>F: Current Status
            F->>R: Update Cache
        end
        F-->>U: Display Status
    end

    U->>F: View Results
    F->>A: Get Review Results
    A-->>F: Full Results
    F->>R: Cache Results
    F-->>U: Display Results

    %% Standards Management Flow
    U->>F: Manage Standards
    F->>A: Fetch Standards
    A->>S: Query Standards
    S-->>A: Standards Data
    A-->>F: Standards List
    F-->>U: Display Standards

    U->>F: Create Standard Set
    F->>A: Create Set Request
    A->>S: Store Set
    S-->>A: Confirmation
    A-->>F: Success Response
    F-->>U: Display Confirmation
```

## Component Architecture

```mermaid
graph TB
    subgraph Frontend Application
        Server[Hapi.js Server]
        Templates[Nunjucks Templates]
        Static[Static Assets]
        Session[Session Management]
        Config[Configuration]
        Cache[Cache Layer]

        Server-->Templates
        Server-->Static
        Server-->Session
        Server-->Config
        Server-->Cache
    end

    subgraph Core Components
        Router[Router]
        Controllers[Controllers]
        Views[Views]
        Services[Services]
        Models[Data Models]

        Router-->Controllers
        Controllers-->Services
        Services-->Models
        Controllers-->Views
    end

    subgraph Feature Modules
        Reviews[Code Reviews]
        Standards[Standards Management]
        Classifications[Classifications]

        Reviews-->Controllers
        Standards-->Controllers
        Classifications-->Controllers
    end

    Server-->Router
```

## Technology Stack

### Frontend Framework

- **Server**: Node.js with Hapi.js
- **Templates**: Nunjucks
- **Styling**: SCSS with GOV.UK Frontend
- **Build Tools**: Webpack + Babel

### State Management

- **Session Management**: Redis (Production) / Memory (Development)
- **Configuration**: Convict
- **Cache Layer**: Catbox with Redis/Memory providers

### Development Tools

- **Type Checking**: TypeScript
- **Testing**: Jest
- **Linting**: ESLint + Prettier
- **Style Linting**: Stylelint

## Key Components

### Server

- Hapi.js server with plugins for:
  - Static file serving
  - Security headers
  - Session management
  - Request logging
  - Metrics collection
  - Rate limiting
  - CSRF protection

### Templates

- Nunjucks templating engine
- GOV.UK Frontend components
- Custom layouts and partials
- Progressive enhancement support

### Configuration

- Environment-based configuration
- Strict validation using Convict
- Support for development and production environments
- Secure secrets management

### Feature Modules

#### Code Reviews

- Repository submission
- Status tracking
- Results viewing
- Cache management

#### Standards Management

- Standard sets CRUD operations
- Standards viewing and organisation
- Classification management
- Markdown rendering

### Session Management

- Redis-based session storage in production
- In-memory session storage for development
- Configurable TTL and cache settings
- Session encryption

### Caching Strategy

The application uses a two-tier caching strategy:

#### Development Environment

- Uses in-memory cache by default (SESSION_CACHE_ENGINE='memory')
- Suitable for local development and testing
- No additional setup required
- Cache is not shared between service instances

#### Production Environment

- Uses Redis as the caching backend (SESSION_CACHE_ENGINE='redis')
- Shared cache across all service instances
- Default configuration:
  - Host: 127.0.0.1
  - Port: 6379
  - Key prefix: 'defra-ai-codereview-frontend:'
  - Configurable username/password
  - Optional TLS support

#### Cache Usage

- Session state management
- Code review results caching
- Standards data caching
- Temporary data storage

To enable Redis locally:

1. Install and start Redis
2. Set SESSION_CACHE_ENGINE=redis
3. Configure Redis connection details via environment variables if needed

## Security

```mermaid
graph TB
    subgraph Security Layers
        direction TB

        L1[Transport Security]
        L2[Application Security]
        L3[Data Security]
        L4[Infrastructure Security]

        subgraph L1
            HTTPS[HTTPS Only]
            Headers[Security Headers]
            TLS[TLS 1.2+]
        end

        subgraph L2
            CSRF[CSRF Protection]
            XSS[XSS Prevention]
            Input[Input Validation]
            Rate[Rate Limiting]
        end

        subgraph L3
            Encrypt[Data Encryption]
            Sessions[Secure Sessions]
            Sanitise[Data Sanitisation]
        end

        subgraph L4
            Network[Network Security]
            Access[Access Control]
            Audit[Audit Logging]
        end
    end
```

### Security Measures

- TLS 1.2+ enforcement
- HTTP Security Headers
  - Content Security Policy (CSP)
  - X-Frame-Options
  - X-Content-Type-Options
  - Referrer-Policy
- CSRF token validation
- Rate limiting by IP
- Input sanitisation
- Session encryption
- Audit logging
- Regular security scanning

## Development Workflow

```mermaid
graph LR
    Dev[Development]-->Lint[Lint & Format]
    Lint-->Test[Testing]
    Test-->Build[Build]
    Build-->Deploy[Deployment]

    subgraph CI/CD
        Lint
        Test
        Build
        Deploy
    end
```

## Dependencies

### Core Dependencies

- Node.js runtime
- Redis (Production only)
- Code Review API service

### External Services

- Code Review API (`API_BASE_URL` configuration)
- Monitoring services
- Logging infrastructure

## Configuration Management

The application uses environment variables for configuration, managed through the Convict library. Key configuration areas:

- Server settings (port, environment)
- API connection details
- Session management
- Logging and metrics
- Security settings
- Rate limiting rules
- Cache configuration

## Monitoring and Logging

- Request tracing with correlation IDs
- Metrics collection
  - Request latency
  - Error rates
  - Cache hit rates
- Structured logging
- Error tracking
- Performance monitoring
- Security audit logs
