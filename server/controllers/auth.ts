import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import env from '../config/env';

const prisma = new PrismaClient();

export const authController = {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !user.password) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, { expiresIn: '24h' });
      
      res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  },

  async signup(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { email, password: hashedPassword, name }
      });

      const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, { expiresIn: '24h' });
      
      res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name } });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  },

  async linkedinCallback(req: Request, res: Response) {
    try {
      const { code } = req.body;
      // Implement LinkedIn OAuth logic here
      res.json({ message: 'LinkedIn authentication successful' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  },

  async logout(req: Request, res: Response) {
    res.json({ message: 'Logged out successfully' });
  }
};