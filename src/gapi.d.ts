// src/gapi.d.ts
declare namespace gapi.client {
    namespace calendar {
      interface Event {
        id: string;
        summary: string;
        start: {
          dateTime?: string;
          date?: string;
        };
      }
  
      interface EventsListResponse {
        result: {
          items: Event[];
        };
      }
  
      interface EventsListParameters {
        calendarId: string;
        timeMin: string;
        showDeleted: boolean;
        singleEvents: boolean;
        maxResults: number;
        orderBy: string;
      }
  
      namespace events {
        function list(request: EventsListParameters): Promise<EventsListResponse>;
      }
    }
  }
  