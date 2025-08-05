import * as React from 'react';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

import { cn } from '../../lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DateTimePickerProps {
  date?: Date;
  onDateChange?: (date: Date) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  showTime?: boolean;
  timeStep?: number; // в минутах
  minTime?: string; // "09:00"
  maxTime?: string; // "18:00"
}

export function DateTimePicker({
  date,
  onDateChange,
  placeholder = 'Выберите дату и время',
  disabled = false,
  className,
  showTime = true,
  timeStep = 30,
  minTime = '09:00',
  maxTime = '18:00',
}: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    date
  );
  const [selectedTime, setSelectedTime] = React.useState<string>('');

  // Генерируем временные слоты
  const generateTimeSlots = () => {
    const slots: string[] = [];
    const [minHour, minMinute] = minTime.split(':').map(Number);
    const [maxHour, maxMinute] = maxTime.split(':').map(Number);

    const startMinutes = minHour * 60 + minMinute;
    const endMinutes = maxHour * 60 + maxMinute;

    for (
      let minutes = startMinutes;
      minutes <= endMinutes;
      minutes += timeStep
    ) {
      const hour = Math.floor(minutes / 60);
      const minute = minutes % 60;
      const timeString = `${hour.toString().padStart(2, '0')}:${minute
        .toString()
        .padStart(2, '0')}`;
      slots.push(timeString);
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();

  React.useEffect(() => {
    if (date) {
      setSelectedDate(date);
      setSelectedTime(format(date, 'HH:mm'));
    }
  }, [date]);

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      const finalDate = new Date(newDate);
      if (selectedTime) {
        const [hours, minutes] = selectedTime.split(':').map(Number);
        finalDate.setHours(hours, minutes, 0, 0);
      }
      setSelectedDate(finalDate);
      onDateChange?.(finalDate);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    if (selectedDate) {
      const [hours, minutes] = time.split(':').map(Number);
      const finalDate = new Date(selectedDate);
      finalDate.setHours(hours, minutes, 0, 0);
      setSelectedDate(finalDate);
      onDateChange?.(finalDate);
    }
  };

  const displayValue = selectedDate
    ? format(selectedDate, showTime ? 'dd.MM.yyyy HH:mm' : 'dd.MM.yyyy', {
        locale: ru,
      })
    : '';

  return (
    <div className={cn('flex gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-[280px] justify-start text-left font-normal',
              !selectedDate && 'text-muted-foreground'
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {displayValue || placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            initialFocus
            disabled={(date) => date < new Date()}
          />
        </PopoverContent>
      </Popover>

      {showTime && (
        <Select value={selectedTime} onValueChange={handleTimeSelect}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Время" />
          </SelectTrigger>
          <SelectContent>
            {timeSlots.map((time) => (
              <SelectItem key={time} value={time}>
                {time}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
