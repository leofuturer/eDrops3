interface Project {
  id: number;
  name: string;
  description: string;
  author: string;
  date: Date;
}
const projects: Project[] = [
  {
    id: 1,
    name: "Project 1",
    description: "This is project 1",
    author: "Author 1",
    date: new Date(),
  },
  {
    id: 2,
    name: "Project 2",
    description: "This is project 2",
    author: "Author 2",
    date: new Date(),
  },
  {
    id: 3,
    name: "Project 3",
    description: "This is project 3",
    author: "Author 3",
    date: new Date(),
  },
];

const getProject = (id: number): Project => {
  return (
    projects.find((project) => project.id === id) || {
      id: 0,
      name: "",
      description: "",
      author: "",
      date: new Date(),
    }
  );
};

export { getProject };
