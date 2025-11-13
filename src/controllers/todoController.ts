import { Response, NextFunction } from "express";
import { Todo } from "../entities/Todo";
import { AppDataSource } from "../config/db";
import {
  createTodoSchema,
  updateTodoSchema,
} from "../validator/todoValidation";
import { AuthRequest } from "../middleware/isAuth";

const todoRepository = AppDataSource.getRepository(Todo);

export async function getTodos(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const todos = await todoRepository.find({
      where: { userId: req.user!.id },
      order: { createdAt: "DESC" },
    });
    res.json({ status: "success", data: todos });
  } catch (error) {
    next(error);
  }
}

export async function createTodo(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = createTodoSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ status: "failed", message: "資料格式錯誤" });
      return;
    }
    const todo = todoRepository.create({
      title: parsed.data.title,
      userId: req.user!.id,
    });
    const saved = await todoRepository.save(todo);
    res.status(201).json({ status: "success", data: saved });
  } catch (error) {
    next(error);
  }
}

export async function updateTodo(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    const parsed = updateTodoSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ status: "failed", message: "更新資料格式錯誤" });
      return;
    }

    const todo = await todoRepository.findOne({
      where: { id, userId: req.user!.id },
    });
    if (!todo) {
      res.status(404).json({ status: "error", message: "不存在或無權限操作" });
      return;
    }

    todo.title = parsed.data.title ?? todo.title;
    todo.completed = parsed.data.completed ?? todo.completed;

    const updatedTodo = await todoRepository.save(todo);
    res.json({ status: "success", data: updatedTodo });
  } catch (error) {
    next(error);
  }
}

export async function deleteTodo(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;

    const todo = await todoRepository.findOne({
      where: { id, userId: req.user!.id },
    });

    if (!todo) {
      res
        .status(404)
        .json({ status: "error", message: "Todo 不存在或無權限操作" });
      return;
    }

    await todoRepository.remove(todo);

    res.json({ status: "success", message: "Todo 已刪除" });
  } catch (error) {
    next(error);
  }
}
