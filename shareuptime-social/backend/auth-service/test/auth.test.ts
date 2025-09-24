import { Request, Response } from 'express';
const request = require('supertest');
const express = require('express');

const app = express();
app.use(express.json());
app.get('/health', (req: Request, res: Response) => res.status(200).send('OK'));

describe('Auth Service - Health Check', () => {
  it('should return 200 OK', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.text).toBe('OK');
  });
});