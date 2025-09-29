import { Options } from 'swagger-jsdoc';

export const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Order Management API',
      version: '1.0.0',
      description: 'A comprehensive REST API for managing customers and orders',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://your-api-domain.com' 
          : `http://localhost:${process.env.PORT || 3000}`,
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Customer: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'clp1234567890',
            },
            name: {
              type: 'string',
              example: 'John Doe',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com',
            },
            phone: {
              type: 'string',
              nullable: true,
              example: '+1234567890',
            },
            address: {
              type: 'string',
              nullable: true,
              example: '123 Main St, City, State',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Order: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'clp1234567890',
            },
            orderNumber: {
              type: 'string',
              example: 'ORD-001',
            },
            status: {
              type: 'string',
              enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
              example: 'PENDING',
            },
            total: {
              type: 'number',
              format: 'decimal',
              example: 99.99,
            },
            notes: {
              type: 'string',
              nullable: true,
              example: 'Special delivery instructions',
            },
            customerId: {
              type: 'string',
              example: 'clp1234567890',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
            customer: {
              $ref: '#/components/schemas/Customer',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  example: 'VALIDATION_ERROR',
                },
                message: {
                  type: 'string',
                  example: 'Invalid input data',
                },
                details: {
                  type: 'object',
                },
              },
            },
          },
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'object',
              properties: {
                items: {
                  type: 'array',
                  items: {},
                },
                pagination: {
                  type: 'object',
                  properties: {
                    page: {
                      type: 'integer',
                      example: 1,
                    },
                    limit: {
                      type: 'integer',
                      example: 10,
                    },
                    total: {
                      type: 'integer',
                      example: 100,
                    },
                    pages: {
                      type: 'integer',
                      example: 10,
                    },
                  },
                },
              },
            },
            message: {
              type: 'string',
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Authentication',
        description: 'Authentication endpoints',
      },
      {
        name: 'Customers',
        description: 'Customer management endpoints',
      },
      {
        name: 'Orders',
        description: 'Order management endpoints',
      },
    ],
  },
  apis: ['./src/controllers/*.ts', './src/routes/*.ts'],
};
