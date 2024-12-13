import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const userController = {
  async getCurrentUser(req: Request, res: Response) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        include: {
          skills: true,
          portfolioItems: true,
        },
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  },

  async updateUser(req: Request, res: Response) {
    try {
      const { skills, portfolioItems, ...userData } = req.body;

      const user = await prisma.user.update({
        where: { id: req.userId },
        data: {
          ...userData,
          skills: {
            deleteMany: {},
            create: skills,
          },
          portfolioItems: {
            deleteMany: {},
            create: portfolioItems,
          },
        },
        include: {
          skills: true,
          portfolioItems: true,
        },
      });

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  },

  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          skills: true,
          portfolioItems: true,
          referencesReceived: {
            where: { status: 'approved' },
            include: {
              fromUser: {
                select: {
                  id: true,
                  name: true,
                  title: true,
                  avatar: true,
                  linkedin: true,
                },
              },
            },
          },
        },
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  },
};