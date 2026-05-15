import initSqlJs from "sql.js";
import wasmUrl from "sql.js/dist/sql-wasm.wasm?url";

let SQLModulePromise;

const schema = [
  `CREATE TABLE students (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    age INTEGER,
    grade TEXT,
    city TEXT,
    gpa REAL
  );`,
  `CREATE TABLE departments (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT,
    budget INTEGER
  );`,
  `CREATE TABLE employees (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT,
    salary INTEGER,
    department_id INTEGER,
    hired_at TEXT,
    FOREIGN KEY (department_id) REFERENCES departments(id)
  );`,
  `CREATE TABLE products (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    price REAL,
    stock INTEGER
  );`,
  `CREATE TABLE customers (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    region TEXT,
    joined_at TEXT
  );`,
  `CREATE TABLE orders (
    id INTEGER PRIMARY KEY,
    customer_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    order_date TEXT,
    status TEXT,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  );`
];

const seedData = [
  `INSERT INTO students VALUES
    (1, 'Ava Patel', 19, 'A', 'Austin', 3.9),
    (2, 'Noah Kim', 21, 'B', 'Seattle', 3.4),
    (3, 'Mia Johnson', 20, 'A', 'Chicago', 3.8),
    (4, 'Liam Brown', 22, 'C', 'Denver', 2.9),
    (5, 'Sophia Chen', 18, 'B', 'Boston', 3.5);`,
  `INSERT INTO departments VALUES
    (1, 'Engineering', 'Remote', 1200000),
    (2, 'Design', 'New York', 480000),
    (3, 'Sales', 'London', 760000),
    (4, 'Operations', 'Berlin', 390000);`,
  `INSERT INTO employees VALUES
    (1, 'Iris Morgan', 'Backend Engineer', 124000, 1, '2022-02-14'),
    (2, 'Marco Silva', 'Product Designer', 98000, 2, '2021-09-01'),
    (3, 'Nora Singh', 'Sales Lead', 111000, 3, '2020-06-18'),
    (4, 'Theo Wright', 'DevOps Engineer', 132000, 1, '2023-01-09'),
    (5, 'Elena Garcia', 'Ops Analyst', 82000, 4, '2022-11-30');`,
  `INSERT INTO products VALUES
    (1, 'Notebook Pro', 'Hardware', 1499.00, 28),
    (2, 'Cloud IDE Seat', 'Software', 39.00, 500),
    (3, 'SQL Hoodie', 'Merch', 64.00, 72),
    (4, 'Data Pack', 'Software', 129.00, 210),
    (5, 'Mechanical Keyboard', 'Hardware', 179.00, 38);`,
  `INSERT INTO customers VALUES
    (1, 'Orbit Labs', 'ops@orbit.test', 'North America', '2023-03-11'),
    (2, 'Nova Studio', 'hello@nova.test', 'Europe', '2022-08-21'),
    (3, 'Zenith AI', 'data@zenith.test', 'Asia Pacific', '2024-01-15'),
    (4, 'Pixel Foundry', 'team@pixel.test', 'Europe', '2021-05-04');`,
  `INSERT INTO orders VALUES
    (1, 1, 2, 18, '2024-01-22', 'paid'),
    (2, 2, 5, 4, '2024-02-03', 'shipped'),
    (3, 3, 4, 9, '2024-02-19', 'paid'),
    (4, 1, 1, 2, '2024-03-01', 'processing'),
    (5, 4, 3, 12, '2024-03-14', 'paid'),
    (6, 2, 2, 25, '2024-04-09', 'paid');`
];

export const sampleQuery = `-- Try editing this query, then press Run Query
SELECT
  customers.name AS customer,
  products.name AS product,
  orders.quantity,
  ROUND(products.price * orders.quantity, 2) AS total
FROM orders
JOIN customers ON customers.id = orders.customer_id
JOIN products ON products.id = orders.product_id
WHERE orders.status = 'paid'
ORDER BY total DESC;`;

export const tableMetadata = [
  { name: "students", accent: "from-sky-400 to-cyan-300", description: "Learners, grades, cities, and GPA scores." },
  { name: "employees", accent: "from-violet-400 to-fuchsia-300", description: "Team members, roles, salaries, and departments." },
  { name: "departments", accent: "from-indigo-400 to-sky-300", description: "Company departments with location and budget." },
  { name: "products", accent: "from-cyan-300 to-emerald-300", description: "Catalog items with category, price, and stock." },
  { name: "customers", accent: "from-blue-400 to-violet-300", description: "Customer accounts, regions, and signup dates." },
  { name: "orders", accent: "from-fuchsia-400 to-sky-300", description: "Purchases connecting customers and products." }
];

export async function createDatabase() {
  if (!SQLModulePromise) {
    SQLModulePromise = initSqlJs({ locateFile: () => wasmUrl });
  }

  const SQL = await SQLModulePromise;
  const db = new SQL.Database();
  [...schema, ...seedData].forEach((statement) => db.run(statement));
  return db;
}

export function executeQuery(db, query) {
  const started = performance.now();
  const results = db.exec(query);
  const elapsedMs = Math.max(0.1, performance.now() - started);
  return {
    results,
    elapsedMs: elapsedMs.toFixed(2),
    rowsChanged: db.getRowsModified()
  };
}

export function getTablePreview(db, tableName, limit = 5) {
  const result = db.exec(`SELECT * FROM ${tableName} LIMIT ${limit};`);
  return result[0] || { columns: [], values: [] };
}

export function getTableCount(db, tableName) {
  const result = db.exec(`SELECT COUNT(*) AS count FROM ${tableName};`);
  return result[0]?.values?.[0]?.[0] ?? 0;
}
