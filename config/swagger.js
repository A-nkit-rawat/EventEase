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
        url: 'http://localhost:8080/api',
        description: 'Development server'
      },
      {
        url: 'https://eventease.200xsecure.com/api',
        description: 'Production server'
      }
      ,{
        url: 'https://event-ease-guyfqznp3-a-nkis-projects.vercel.app/api',
        description: 'Render Deployment'
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
  apis: ['./routes/*.js', './controllers/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app) => {
  // Custom Swagger UI HTML with CDN links (works on Vercel)
  app.get('/api-docs', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>EventEase API Documentation</title>
        <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css">
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            background: #fafafa;
          }
          .topbar { 
            display: none !important; 
          }
          .swagger-ui .info {
            margin: 20px 0;
          }
          .swagger-ui .info .title {
            color: #6366f1;
          }
        </style>
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
        <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js"></script>
        <script>
          window.onload = function() {
            const ui = SwaggerUIBundle({
              url: '/api-docs.json',
              dom_id: '#swagger-ui',
              deepLinking: true,
              presets: [
                SwaggerUIBundle.presets.apis,
                SwaggerUIStandalonePreset
              ],
              plugins: [
                SwaggerUIBundle.plugins.DownloadUrl
              ],
              layout: "StandaloneLayout",
              persistAuthorization: true
            });
            window.ui = ui;
          };
        </script>
      </body>
      </html>
    `);
  });

  // JSON format
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log(`📚 Swagger docs available at /api-docs`);
};

module.exports = swaggerDocs;