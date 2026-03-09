import { useState, useEffect } from 'react';
import { Navigation } from '@/app/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Badge } from '@/app/components/ui/badge';
import { useNavigationStore, useTasksStore, Task } from '@/stores';
import { CheckSquare, Plus, ChevronDown, ChevronRight, Trash2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

export function TasksScreen() {
  const { currentScreen, navigate } = useNavigationStore();
  const {
    tasks,
    isLoading,
    error,
    addTask,
    deleteTask,
    toggleTask,
    addSubTask,
    toggleSubTask,
    deleteSubTask,
    toggleExpanded
  } = useTasksStore();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newMicroStep, setNewMicroStep] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    await addTask({
      title: newTaskTitle,
      description: '',
      priority: 'medium',
      completed: false,
      subTasks: [],
    });
    setNewTaskTitle('');
    toast.success('Tarefa adicionada!');
  };

  const handleAddMicroStep = async (taskId: string) => {
    const stepText = newMicroStep[taskId];
    if (!stepText?.trim()) return;

    await addSubTask(taskId, {
      title: stepText,
      completed: false,
    });

    setNewMicroStep({ ...newMicroStep, [taskId]: '' });
    toast.success('Micro-etapa adicionada!');
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
      
      <main className="container mx-auto p-16 md:p-16 space-y-6" role="main">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <CheckSquare className="h-8 w-8 text-purple-500" aria-hidden="true" />
            Tarefas
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie suas tarefas com micro-etapas para facilitar a execução
          </p>
        </div>

        {error && (
            <Card className="border-red-500 bg-red-50 dark:bg-red-900/10">
                <CardContent className="flex items-center p-4 text-red-800 dark:text-red-200">
                    <AlertCircle className="h-5 w-5 mr-2" aria-hidden="true" />
                    <span>Erro ao sincronizar tarefas. Verifique sua conexão.</span>
                </CardContent>
            </Card>
        )}

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
              <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden" role="progressbar" aria-valuenow={completionPercentage} aria-valuemin={0} aria-valuemax={100}>
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
                handleAddTask();
              }}
              className="flex gap-2"
            >
              <Input
                placeholder="Digite o título da tarefa..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                aria-label="Título da nova tarefa"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !newTaskTitle.trim()}>
                <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                Adicionar
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Tasks List */}
        <div className="space-y-3" aria-live="polite">
          {isLoading && tasks.length === 0 ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" aria-label="Carregando tarefas"></div>
            </div>
          ) : (
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
                            {task.subTasks && task.subTasks.length > 0 && (
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {task.subTasks.filter((s) => s.completed).length} de{' '}
                                {task.subTasks.length} etapas concluídas
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
                              {task.subTasks?.map((step) => (
                                <div key={step.id} className="flex items-center gap-2 group">
                                  <Checkbox
                                    id={`step-${step.id}`}
                                    checked={step.completed}
                                    onCheckedChange={() => toggleSubTask(task.id, step.id)}
                                    aria-label={step.title}
                                  />
                                  <label
                                    htmlFor={`step-${step.id}`}
                                    className={`flex-1 text-sm cursor-pointer ${
                                      step.completed ? 'line-through text-gray-500' : ''
                                    }`}
                                  >
                                    {step.title}
                                  </label>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                                    onClick={() => deleteSubTask(task.id, step.id)}
                                    aria-label={`Excluir etapa ${step.title}`}
                                  >
                                    <Trash2 className="h-3 w-3 text-red-500" />
                                  </Button>
                                </div>
                              ))}

                              {/* Add Micro Step */}
                              <form
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  handleAddMicroStep(task.id);
                                }}
                                className="flex gap-2 pt-2"
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
                                  className="text-sm h-8"
                                  aria-label="Nova micro-etapa"
                                />
                                <Button type="submit" size="sm" className="h-8">
                                  <Plus className="h-3 w-3 mr-1" aria-hidden="true" />
                                  Add
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
          )}

          {!isLoading && tasks.length === 0 && (
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