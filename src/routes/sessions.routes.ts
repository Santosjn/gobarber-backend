import { Router } from 'express';
import CreateSessionService from '../services/CreateSesssionService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
  const { email, password } = request.body;

  const authenticateUser = new CreateSessionService();

  const { user, token } = await authenticateUser.execute({ email, password });

  delete user.password;

  return response.json({ user, token });
});

export default sessionsRouter;
