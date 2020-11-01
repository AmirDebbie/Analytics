///<reference path="types.ts" />

import express from "express";
import { Request, Response } from "express";

// some useful database functions in here:
import { getAllEvents, createNewEvent, getAllSessionsByDateAndHour } from "./database";
import { Event, weeklyRetentionObject } from "../../client/src/models/event";
import { ensureAuthenticated, validateMiddleware } from "./helpers";

import {
  shortIdValidation,
  searchValidation,
  userFieldsValidator,
  isUserValidator,
} from "./validators";
const router = express.Router();

// Routes

interface Filter {
  sorting: string;
  type: string;
  browser: string;
  search: string;
  offset: number;
}

export const dateString = (dateNum: number): string => {
  const date: Date = new Date(dateNum);
  let mm: number = date.getMonth() + 1; // getMonth() is zero-based
  let dd: number = date.getDate();

  return [date.getFullYear(), (mm > 9 ? "" : "0") + mm, (dd > 9 ? "" : "0") + dd].join("/");
};

const daysToMiliSeconds = (days: number): number => {
  return days * 24 * 60 * 60 * 1000;
};

router.get("/all", (req: Request, res: Response) => {
  const events: Event[] = getAllEvents();
  res.json(events);
});

router.get("/all-filtered", (req: Request, res: Response) => {
  const filters: Filter = req.query;
  let filtered: any[] = getAllEvents();

  if (filters.search) {
    const reg: RegExp = new RegExp(filters.search, "i");
    filtered = filtered.filter((event) => {
      let checker = false;
      for (const key in event) {
        if (reg.test(event[key])) {
          checker = true;
        }
      }
      return checker;
    });
  }

  if (filters.type) {
    filtered = filtered.filter((event: Event) => event.name === filters.type);
  }

  if (filters.browser) {
    filtered = filtered.filter((event: Event) => event.browser === filters.browser);
  }

  if (filters.sorting) {
    filtered.sort((firstEvent: Event, secondEvent: Event) =>
      filters.sorting === "+date"
        ? firstEvent.date - secondEvent.date
        : secondEvent.date - firstEvent.date
    );
  }

  res.json({
    events: filtered.slice(0, filters.offset || filtered.length),
  });
});

router.get("/by-days/:offset", (req: Request, res: Response) => {
  const events: Event[] = getAllEvents();
  const offset: number = +req.params.offset;
  let startDate: number = new Date().valueOf() - daysToMiliSeconds(offset - 1);
  const day: number = new Date(startDate).getDate();
  const month: number = new Date(startDate).getMonth() + 1;
  const year: number = new Date(startDate).getFullYear();
  startDate = new Date(`${year}/${month}/${day}`).valueOf();
  const endDate: number = startDate - daysToMiliSeconds(7);

  let filtered: Event[] = events.filter((event) => endDate <= event.date && startDate > event.date);

  let result: any = {};
  for (let event of filtered) {
    if (result[dateString(event.date)]) {
      if (!result[dateString(event.date)].some((session: string) => session === event.session_id)) {
        result[dateString(event.date)].push(event.session_id);
      }
    } else {
      result[dateString(event.date)] = [event.session_id];
    }
  }
  let arrResult: Array<{ date: string; count: number }> = [];
  let i: number = 0;
  for (let key in result) {
    arrResult[i] = {
      date: key,
      count: result[key].length,
    };
    i++;
  }
  res.json(arrResult);
});

router.get("/by-hours/:offset", (req: Request, res: Response) => {
  const offset: number = +req.params.offset;
  let date: number = new Date().valueOf();
  if (offset > 0) {
    date -= daysToMiliSeconds(offset);
  }
  let sessionsByHours: Array<{ hour: string; count: number }> = [];

  for (let i = 0; i < 24; i++) {
    const sessions: string[] = getAllSessionsByDateAndHour(date, i);
    const sessionsSet: string[] = Array.from(new Set(sessions));
    sessionsByHours.push({
      hour: `${i.toString().padStart(2, "0")}:00`,
      count: sessionsSet.length,
    });
  }
  console.log(sessionsByHours);
  res.json(sessionsByHours);
});

router.get("/today", (req: Request, res: Response) => {
  res.send("/today");
});

router.get("/week", (req: Request, res: Response) => {
  res.send("/week");
});

router.get("/retention", (req: Request, res: Response) => {
  const { dayZero } = req.query;
  res.send("/retention");
});
router.get("/:eventId", (req: Request, res: Response) => {
  res.send("/:eventId");
});

router.post("/", (req: Request, res: Response) => {
  try {
    const event: Event = req.body;
    createNewEvent(event);
    res.json({ message: "Event added" });
  } catch (error) {
    res.json({ message: error.message });
  }
});

router.get("/chart/os/:time", (req: Request, res: Response) => {
  res.send("/chart/os/:time");
});

router.get("/chart/pageview/:time", (req: Request, res: Response) => {
  res.send("/chart/pageview/:time");
});

router.get("/chart/timeonurl/:time", (req: Request, res: Response) => {
  res.send("/chart/timeonurl/:time");
});

router.get("/chart/geolocation/:time", (req: Request, res: Response) => {
  res.send("/chart/geolocation/:time");
});

export default router;
