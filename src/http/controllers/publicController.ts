import { Request, Response } from 'express';

const home = async (req: Request, res: Response): Promise<any> => {
  try {
    const data = {
      message: "Welcome to the home page",
      error: false
    }
    res.status(200);
    res.json(data);
  } catch (error) {
    res.json(error);
  }
}

export { home };
