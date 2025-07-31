import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useState } from 'react';

const itPositions = [
  // Frontend разработка
  {
    value: 'frontend-developer',
    label: 'Frontend Developer',
    category: 'Frontend',
  },
  {
    value: 'react-developer',
    label: 'React Developer',
    category: 'Frontend',
  },
  {
    value: 'vue-developer',
    label: 'Vue.js Developer',
    category: 'Frontend',
  },
  {
    value: 'angular-developer',
    label: 'Angular Developer',
    category: 'Frontend',
  },
  {
    value: 'ui-ux-developer',
    label: 'UI/UX Developer',
    category: 'Frontend',
  },

  // Backend разработка
  {
    value: 'backend-developer',
    label: 'Backend Developer',
    category: 'Backend',
  },
  {
    value: 'nodejs-developer',
    label: 'Node.js Developer',
    category: 'Backend',
  },
  {
    value: 'python-developer',
    label: 'Python Developer',
    category: 'Backend',
  },
  {
    value: 'java-developer',
    label: 'Java Developer',
    category: 'Backend',
  },
  {
    value: 'csharp-developer',
    label: 'C# Developer',
    category: 'Backend',
  },
  {
    value: 'php-developer',
    label: 'PHP Developer',
    category: 'Backend',
  },
  {
    value: 'go-developer',
    label: 'Go Developer',
    category: 'Backend',
  },

  // Full Stack разработка
  {
    value: 'fullstack-developer',
    label: 'Full Stack Developer',
    category: 'Full Stack',
  },
  {
    value: 'mern-developer',
    label: 'MERN Stack Developer',
    category: 'Full Stack',
  },
  {
    value: 'mean-developer',
    label: 'MEAN Stack Developer',
    category: 'Full Stack',
  },

  // Мобильная разработка
  {
    value: 'ios-developer',
    label: 'iOS Developer',
    category: 'Mobile',
  },
  {
    value: 'android-developer',
    label: 'Android Developer',
    category: 'Mobile',
  },
  {
    value: 'react-native-developer',
    label: 'React Native Developer',
    category: 'Mobile',
  },
  {
    value: 'flutter-developer',
    label: 'Flutter Developer',
    category: 'Mobile',
  },

  // DevOps и инфраструктура
  {
    value: 'devops-engineer',
    label: 'DevOps Engineer',
    category: 'DevOps',
  },
  {
    value: 'site-reliability-engineer',
    label: 'Site Reliability Engineer (SRE)',
    category: 'DevOps',
  },
  {
    value: 'cloud-engineer',
    label: 'Cloud Engineer',
    category: 'DevOps',
  },
  {
    value: 'infrastructure-engineer',
    label: 'Infrastructure Engineer',
    category: 'DevOps',
  },

  // Data Science и аналитика
  {
    value: 'data-scientist',
    label: 'Data Scientist',
    category: 'Data',
  },
  {
    value: 'data-engineer',
    label: 'Data Engineer',
    category: 'Data',
  },
  {
    value: 'data-analyst',
    label: 'Data Analyst',
    category: 'Data',
  },
  {
    value: 'machine-learning-engineer',
    label: 'Machine Learning Engineer',
    category: 'Data',
  },

  // QA и тестирование
  {
    value: 'qa-engineer',
    label: 'QA Engineer',
    category: 'QA',
  },
  {
    value: 'test-automation-engineer',
    label: 'Test Automation Engineer',
    category: 'QA',
  },
  {
    value: 'manual-tester',
    label: 'Manual Tester',
    category: 'QA',
  },

  // Безопасность
  {
    value: 'security-engineer',
    label: 'Security Engineer',
    category: 'Security',
  },
  {
    value: 'cybersecurity-analyst',
    label: 'Cybersecurity Analyst',
    category: 'Security',
  },
  {
    value: 'penetration-tester',
    label: 'Penetration Tester',
    category: 'Security',
  },

  // Управление проектами
  {
    value: 'project-manager',
    label: 'Project Manager',
    category: 'Management',
  },
  {
    value: 'product-manager',
    label: 'Product Manager',
    category: 'Management',
  },
  {
    value: 'scrum-master',
    label: 'Scrum Master',
    category: 'Management',
  },

  // Специализированные роли
  {
    value: 'blockchain-developer',
    label: 'Blockchain Developer',
    category: 'Specialized',
  },
  {
    value: 'game-developer',
    label: 'Game Developer',
    category: 'Specialized',
  },
  {
    value: 'embedded-developer',
    label: 'Embedded Developer',
    category: 'Specialized',
  },
  {
    value: 'system-administrator',
    label: 'System Administrator',
    category: 'Specialized',
  },
  {
    value: 'database-administrator',
    label: 'Database Administrator',
    category: 'Specialized',
  },
];

const Interview = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  console.log('🚀 ~ Interview ~ value:', value);
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Link to="/">
            <Button variant="outline">← Назад</Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Собеседование</h1>
          <div className="w-20"></div>
        </div>

        <Card className="max-w-2xl mx-auto w-full">
          <CardHeader>
            <CardTitle>Моковое собеседование</CardTitle>
            <CardDescription>
              Видео конфиренция с коллегами по профессии
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 flex flex-col items-center">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[200px] justify-between"
                >
                  {value
                    ? itPositions.find((framework) => framework.value === value)
                        ?.label
                    : 'Профессия...'}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput
                    placeholder="Search framework..."
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty>No framework found.</CommandEmpty>
                    <CommandGroup>
                      {itPositions.map((framework) => (
                        <CommandItem
                          key={framework.value}
                          value={framework.value}
                          onSelect={(currentValue) => {
                            setValue(
                              currentValue === value ? '' : currentValue
                            );
                            setOpen(false);
                          }}
                        >
                          {framework.label}
                          <Check
                            className={cn(
                              'ml-auto',
                              value === framework.value
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <div className="flex justify-between pt-4 w-full">
              <Button variant="outline">Предыдущий</Button>
              <Button>Следующий</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Interview;
