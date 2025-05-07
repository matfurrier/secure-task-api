require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const authRoutes = require('./routes/authRoutes'); // Descomentado e importado
const taskRoutes = require('./routes/taskRoutes'); // Descomentado e importado
const { authenticateToken } = require('./middlewares/authMiddleware'); // Importado (embora usado dentro de taskRoutes)

const app = express();
const PORT = process.env.PORT || 3120;

app.use(express.json());

// Swagger Configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API REST JWT',
      version: '1.0.0',
      description: 'API para gerenciamento de tarefas com autenticação JWT e RBAC',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
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
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'], // Caminhos para os arquivos com anotações Swagger
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/auth', authRoutes); // Rotas de autenticação registradas
// app.use('/tasks', authenticateToken, taskRoutes); // Protected task routes

app.get('/', (req, res) => {
  res.send('API is running!');
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app; // Export for testing 