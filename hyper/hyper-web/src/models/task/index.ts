import crypto from "crypto";

export type TaskHash = string;

export type Task = {
  id: TaskHash;
  name: string;
  completed: boolean;
  now: boolean;
  prerequisites: Task[];
};

export type SerializedTask = {
  id: TaskHash;
  name: string;
  completed: boolean;
  now: boolean;
  prerequisites: TaskHash[];
};

type Milestone = { name: string; collection: Task[] };

const flatten = (tasks: Task[]): Task[] => {
  const collection: Task[] = [];
  function flattenInner(tasks: Task[]) {
    tasks.forEach((task) => {
      collection.push(task);
      if (task.prerequisites) flattenInner(task.prerequisites);
    });
  }
  flattenInner(tasks);
  if (collection.length === 0) throw new Error("collection should never be empty");
  return collection as Task[];
};

export const milestoneFromTasks = (name: string, tasks: Task[]): Milestone => {
  return {
    name,
    collection: flatten(tasks),
  };
};

const unique = (tasks: Task[]): Task[] => {
  const collection: Task[] = [];
  tasks.forEach((task) => {
    if (!collection.some((t) => task.name === t.name)) collection.push(task);
  });
  return collection;
};

export const dueNow = (tasks: Task[]): Task[] =>
  unique(flatten(tasks)).filter((task) => task.now && !task.completed) as Task[];

const sha256Digest = (data: string): string => {
  const hash = crypto.createHash("sha256");
  hash.update(data);
  return hash.digest().toString("hex");
};

const serializeTask = (task: Task): SerializedTask => {
  const data = {
    name: task.name,
    now: task.now ? true : false,
    completed: task.completed ? true : false,
    prerequisites: task.prerequisites.map((p) => serializeTask(p)).map((s) => s.id),
  };
  return {
    id: sha256Digest(JSON.stringify(data)),
    ...data,
  };
};

const serializeTaskArray = (tasks: Task[]): SerializedTask[] => {
  const serialized: SerializedTask[] = [];
  const _serializeTaskArray = (tasks: Task[]) =>
    tasks.forEach((task) => {
      _serializeTaskArray(task.prerequisites);
      const serializedTask = serializeTask(task);
      if (!serialized.some((t) => t.id === serializedTask.id)) serialized.push(serializedTask);
    });
  _serializeTaskArray(tasks);
  return serialized;
};

export const upload = (tasks: Task[]): void => {
  const serialized: SerializedTask[] = serializeTaskArray(tasks);
  serialized.forEach((task) => {
    console.log("uploading task ID: ", task);
    fetch(`http://localhost:7777/data/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
};

export const download = async (): Promise<Task[]> => {
  const data = await fetch("http://localhost:7777/data/tasks");
  const serialized = (await data.json()) as SerializedTask[];
  const deserialized: Task[] = [];
  while (serialized.length > 0) {
    const task = serialized[0];
    const deserializedPrerequisites = task.prerequisites.map((p) => deserialized.filter((d) => d.id === p)[0]);
    if (deserializedPrerequisites.length !== task.prerequisites.length) {
      throw new Error("deserialization algorithm is inefficient");
    } else {
      const deserializedTask: Task = {
        id: task.id,
        completed: task.completed,
        now: task.now,
        name: task.name,
        prerequisites: deserializedPrerequisites,
      };
      deserialized.push(deserializedTask);
      serialized.shift();
    }
  }
  return findRoots(deserialized);
};

export const findRoots = (tasks: Task[]): Task[] => {
  const nonRoots: TaskHash[] = [];
  const _findRoots = (tasks: Task[]) => {
    tasks.forEach((task) => {
      try {
        nonRoots.push(...task.prerequisites.map((t) => t.id));
      } catch (error) {
        console.log(task);
      }
      _findRoots(task.prerequisites);
    });
  };
  _findRoots(tasks);
  return tasks.filter((task) => nonRoots.every((id) => task.id !== id));
};
