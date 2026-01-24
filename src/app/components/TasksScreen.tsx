import { useState } from 'react';
import { Navigation } from '@/app/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Badge } from '@/app/components/ui/badge';
import { useNavigationStore, useTasksStore } from '@/stores';
import { CheckSquare, Plus, ChevronDown, ChevronRight, Trash2, GripVertical } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

interface MicroStep {
  id: string;
  text: string;
  completed: boolean;
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  microSteps: MicroStep[];
  expanded: boolean;
}

export function TasksScreen() {
  const { currentScreen, navigate } = useNavigationStore();
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Revisar documentação do projeto',
      completed: false,
      priority: 'high',
      expanded: true,
      microSteps: [
        { id: '1-1', text: 'Abrir documento', completed: true },
        { id: '1-2', text: 'Ler seção de introdução', completed: true },
        { id: '1-3', text: 'Revisar requisitos', completed: false },
        { id: '1-4', text: 'Fazer anotações', completed: false },
      ],
    },
    {
      id: '2',
      title: 'Responder emails importantes',
      completed: false,
      priority: 'medium',
      expanded: false,
      microSteps: [
        { id: '2-1', text: 'Abrir caixa de entrada', completed: false },
        { id: '2-2', text: 'Ler email do cliente A', completed: false },
        { id: '2-3', text: 'Preparar resposta', completed: false },
      ],
    },
    {
      id: '3',
      title: 'Fazer exercício físico',
      completed: true,
      priority: 'low',
      expanded: false,
      microSteps: [
        { id: '3-1', text: 'Vestir roupa de treino', completed: true },
        { id: '3-2', text: 'Alongamento 5 min', completed: true },
        { id: '3-3', text: 'Exercício principal 20 min', completed: true },
      ],
    },
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newMicroStep, setNewMicroStep] = useState<{ [key: string]: string }>({});

  const addTask = () => {
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      completed: false,
      priority: 'medium',
      microSteps: [],
      expanded: false,
    };

    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
    toast.success('Tarefa adicionada!');
  };

  const toggleTask = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const toggleMicroStep = (taskId: string, stepId: string) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          const updatedSteps = task.microSteps.map((step) =>
            step.id === stepId ? { ...step, completed: !step.completed } : step
          );
          const allCompleted = updatedSteps.every((s) => s.completed);
          return { ...task, microSteps: updatedSteps, completed: allCompleted };
        }
        return task;
      })
    );
  };

  const addMicroStep = (taskId: string) => {
    const stepText = newMicroStep[taskId];
    if (!stepText?.trim()) return;

    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          const newStep: MicroStep = {
            id: `${taskId}-${Date.now()}`,
            text: stepText,
            completed: false,
          };
          return { ...task, microSteps: [...task.microSteps, newStep] };
        }
        return task;
      })
    );

    setNewMicroStep({ ...newMicroStep, [taskId]: '' });
    toast.success('Micro-etapa adicionada!');
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
    toast.success('Tarefa removida');
  };

  const toggleExpanded = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, expanded: !task.expanded } : task
      )
    );
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    }
  };

  const getPriorityLabel = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Média';
      case 'low':
        return 'Baixa';
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navigation currentScreen={currentScreen} onNavigate={navigate} />
      
      <main className="container mx-auto p-4 md:p-6 space-y-6" role="main">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <CheckSquare className="h-8 w-8 text-purple-500" aria-hidden="true" />
            Tarefas
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie suas tarefas com micro-etapas para facilitar a execução
          </p>
        </div>

        {/* Progress Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Progresso de Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>
                  {completedCount} de {totalCount} tarefas concluídas
                </span>
                <span className="font-bold">{completionPercentage}%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPercentage}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add New Task */}
        <Card>
          <CardHeader>
            <CardTitle>Nova Tarefa</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addTask();
              }}
              className="flex gap-2"
            >
              <Input
                placeholder="Digite o título da tarefa..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                aria-label="Título da nova tarefa"
              />
              <Button type="submit">
                <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                Adicionar
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Tasks List */}
        <div className="space-y-3">
          <AnimatePresence>
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.2 }}
              >
                <Card className={task.completed ? 'opacity-60' : ''}>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      {/* Task Header */}
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id={`task-${task.id}`}
                          checked={task.completed}
                          onCheckedChange={() => toggleTask(task.id)}
                          aria-label={`Marcar "${task.title}" como ${task.completed ? 'não concluída' : 'concluída'}`}
                        />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <label
                              htmlFor={`task-${task.id}`}
                              className={`font-medium cursor-pointer ${
                                task.completed ? 'line-through text-gray-500' : ''
                              }`}
                            >
                              {task.title}
                            </label>
                            <Badge className={getPriorityColor(task.priority)}>
                              {getPriorityLabel(task.priority)}
                            </Badge>
                          </div>
                          {task.microSteps.length > 0 && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {task.microSteps.filter((s) => s.completed).length} de{' '}
                              {task.microSteps.length} etapas concluídas
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpanded(task.id)}
                          aria-label={task.expanded ? 'Recolher micro-etapas' : 'Expandir micro-etapas'}
                          aria-expanded={task.expanded}
                        >
                          {task.expanded ? (
                            <ChevronDown className="h-4 w-4" aria-hidden="true" />
                          ) : (
                            <ChevronRight className="h-4 w-4" aria-hidden="true" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteTask(task.id)}
                          aria-label={`Excluir tarefa "${task.title}"`}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" aria-hidden="true" />
                        </Button>
                      </div>

                      {/* Micro Steps */}
                      <AnimatePresence>
                        {task.expanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="ml-9 space-y-2 border-l-2 border-purple-200 dark:border-purple-800 pl-4"
                          >
                            {task.microSteps.map((step) => (
                              <div key={step.id} className="flex items-center gap-2">
                                <Checkbox
                                  id={`step-${step.id}`}
                                  checked={step.completed}
                                  onCheckedChange={() => toggleMicroStep(task.id, step.id)}
                                  aria-label={step.text}
                                />
                                <label
                                  htmlFor={`step-${step.id}`}
                                  className={`text-sm cursor-pointer ${
                                    step.completed ? 'line-through text-gray-500' : ''
                                  }`}
                                >
                                  {step.text}
                                </label>
                              </div>
                            ))}

                            {/* Add Micro Step */}
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                addMicroStep(task.id);
                              }}
                              className="flex gap-2"
                            >
                              <Input
                                placeholder="Adicionar micro-etapa..."
                                value={newMicroStep[task.id] || ''}
                                onChange={(e) =>
                                  setNewMicroStep({
                                    ...newMicroStep,
                                    [task.id]: e.target.value,
                                  })
                                }
                                className="text-sm"
                                aria-label="Nova micro-etapa"
                              />
                              <Button type="submit" size="sm">
                                <Plus className="h-3 w-3" aria-hidden="true" />
                              </Button>
                            </form>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {tasks.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" aria-hidden="true" />
                <p className="text-gray-500 dark:text-gray-400">
                  Nenhuma tarefa ainda. Adicione uma nova tarefa acima!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}