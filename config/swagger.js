const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { de } = require('zod/v4/locales');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EventEase API Documentation',
      version: '1.0.0',
      description: 'Complete API documentation for EventEase - Event Booking System',
      contact: {
        name: 'API Support',
        email: 'demo@eventease.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server'
      },
      {
        url: 'https://eventease.200xsecure.com/api',
        description: 'Production server'
      }
      ,{
        url: 'https://event-ease-guyfqznp3-a-nkis-projects.vercel.app/',
        description: 'Vercel Deployment'
      }

    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer <token>'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['username', 'email', 'password', 'role'],
          properties: {
            username: {
              type: 'string',
              minLength: 3,
              example: 'ankit'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'ankit@example.com'
            },
            password: {
              type: 'string',
              minLength: 6,
              example: 'password123'
            },
            role: {
              type: 'string',
              example: 'admin || user'
            }
          }
        },
        Admin: {
          type: 'object',
          required: ['username', 'email', 'password', 'role'],
          properties: {
            username: {
              type: 'string',
              minLength: 3,
              example: 'adminuser'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'admin@example.com'
            },
            password: {
              type: 'string',
              minLength: 6,
              example: 'admin123'
            },
            name: {
              type: 'string',
              example: 'Admin User'
            }
          }
        },
        Event: {
          type: 'object',
          required: ['eventName', 'eventSeats', 'eventCategory', 'eventLocation', 'eventDate'],
          properties: {
            eventName: {
              type: 'string',
              example: 'Tech Conference 2025'
            },
            eventSeats: {
              type: 'number',
              minimum: 1,
              example: 100
            },
            eventCategory: {
              type: 'string',
              example: 'Technology'
            },
            eventLocation: {
              type: 'string',
              enum: ['Online', 'In-Person'],
              example: 'In-Person'
            },
            eventDate: {
              type: 'string',
              format: 'date-time',
              example: '2025-11-15T10:00:00.000Z'
            }
          }
        },
        Booking: {
          type: 'object',
          required: ['eventId'],
          properties: {
            eventId: {
              type: 'string',
              example: 'EVT-23-OCT-2026'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Error message'
            },
            error: {
              type: 'string',
              example: 'Detailed error message'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Operation successful'
            },
            data: {
              type: 'object'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User and Admin authentication endpoints'
      },
      {
        name: 'User Events',
        description: 'User event browsing and booking endpoints'
      },
      {
        name: 'Admin Events',
        description: 'Admin event management endpoints'
      }
    ]
  },
  apis: ['../routes/*.js', '../controllers/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app) => {
  // Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'EventEase API Documentation'
  }));

  // JSON format
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

//   console.log(`📚 Swagger docs available at http://localhost:${process.env.PORT || 3000}/api-docs`);
};

module.exports = swaggerDocs;