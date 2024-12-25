import { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import { Promise } from '../types/database';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface PromiseCalendarProps {
  promises: Promise[];
}

export function PromiseCalendar({ promises }: PromiseCalendarProps) {
  const [selectedPromise, setSelectedPromise] = useState<Promise | null>(null);

  const events = promises.map(promise => ({
    id: promise.id,
    title: promise.title,
    start: new Date(promise.deadline),
    end: new Date(promise.deadline),
    resource: promise,
  }));

  const eventStyleGetter = (event: any) => {
    const promise = event.resource as Promise;
    let backgroundColor = '#FCD34D'; // yellow for pending
    
    if (promise.status === 'completed') {
      backgroundColor = '#34D399'; // green
    } else if (promise.status === 'failed') {
      backgroundColor = '#EF4444'; // red
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
      },
    };
  };

  return (
    <>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        eventPropGetter={eventStyleGetter}
        onSelectEvent={(event) => setSelectedPromise(event.resource)}
        views={['month']}
        defaultView="month"
        className="h-full"
      />
      
      {selectedPromise && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-2">{selectedPromise.title}</h3>
            <p className="text-gray-600 mb-4">{selectedPromise.description}</p>
            <div className="text-sm text-gray-500 mb-4">
              <p>Deadline: {format(new Date(selectedPromise.deadline), 'PPP')}</p>
              <p>Penalty: ${selectedPromise.penalty_amount}</p>
              <p>Status: {selectedPromise.status}</p>
            </div>
            <button
              onClick={() => setSelectedPromise(null)}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}