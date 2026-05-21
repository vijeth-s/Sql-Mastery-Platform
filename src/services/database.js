import initSqlJs from "sql.js";
import wasmUrl from "sql.js/dist/sql-wasm.wasm?url";

let SQLModulePromise;

const schema = [
  `CREATE TABLE students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER,
    grade TEXT,
    city TEXT,
    gpa REAL
  );`,
  `CREATE TABLE departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    location TEXT,
    budget INTEGER
  );`,
  `CREATE TABLE employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT,
    salary INTEGER,
    department_id INTEGER,
    hired_at TEXT,
    FOREIGN KEY (department_id) REFERENCES departments(id)
  );`,
  `CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT,
    price REAL,
    stock INTEGER
  );`,
  `CREATE TABLE customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT,
    region TEXT,
    joined_at TEXT
  );`,
  `CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
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
    (1,  'Ava Patel',      19, 'A', 'Austin',       3.9),
    (2,  'Noah Kim',       21, 'B', 'Seattle',       3.4),
    (3,  'Mia Johnson',    20, 'A', 'Chicago',       3.8),
    (4,  'Liam Brown',     22, 'C', 'Denver',        2.9),
    (5,  'Sophia Chen',    18, 'B', 'Boston',        3.5),
    (6,  'Ethan Davis',    23, 'A', 'Austin',        3.7),
    (7,  'Olivia Smith',   19, 'B', 'New York',      3.3),
    (8,  'James Wilson',   21, 'C', 'Chicago',       2.7),
    (9,  'Emma Martinez',  20, 'A', 'Seattle',       3.95),
    (10, 'Lucas Anderson', 22, 'B', 'Boston',        3.1),
    (11, 'Isabella Thomas',18, 'A', 'Denver',        3.85),
    (12, 'Mason Jackson',  24, 'D', 'New York',      2.4),
    (13, 'Amelia White',   19, 'B', 'Austin',        3.6),
    (14, 'Aiden Harris',   21, 'A', 'Chicago',       3.75),
    (15, 'Harper Lewis',   20, 'C', 'Seattle',       2.85),
    (16, 'Elijah Clark',   22, 'B', 'Boston',        3.2),
    (17, 'Charlotte Hall', 18, 'A', 'Denver',        3.88),
    (18, 'Oliver Young',   23, 'C', 'New York',      2.6),
    (19, 'Evelyn Allen',   20, 'B', 'Austin',        3.45),
    (20, 'Benjamin Scott', 21, 'A', 'Chicago',       3.65);`,
  `INSERT INTO departments VALUES
    (1, 'Engineering',  'Remote',   1200000),
    (2, 'Design',       'New York',  480000),
    (3, 'Sales',        'London',    760000),
    (4, 'Operations',   'Berlin',    390000),
    (5, 'Marketing',    'Austin',    520000),
    (6, 'Data Science', 'Remote',    940000);`,
  `INSERT INTO employees VALUES
    (1,  'Iris Morgan',    'Backend Engineer',    124000, 1, '2022-02-14'),
    (2,  'Marco Silva',    'Product Designer',     98000, 2, '2021-09-01'),
    (3,  'Nora Singh',     'Sales Lead',          111000, 3, '2020-06-18'),
    (4,  'Theo Wright',    'DevOps Engineer',     132000, 1, '2023-01-09'),
    (5,  'Elena Garcia',   'Ops Analyst',          82000, 4, '2022-11-30'),
    (6,  'Sam Okafor',     'Frontend Engineer',   115000, 1, '2021-04-22'),
    (7,  'Priya Nair',     'Data Scientist',      138000, 6, '2020-11-15'),
    (8,  'Jake Bennett',   'Sales Rep',            74000, 3, '2023-03-07'),
    (9,  'Yuki Tanaka',    'UX Designer',          92000, 2, '2022-07-19'),
    (10, 'Chloe Dupont',   'ML Engineer',         145000, 6, '2021-01-30'),
    (11, 'Raj Mehta',      'Ops Manager',          97000, 4, '2019-08-12'),
    (12, 'Finn O''Brien',  'Marketing Manager',   103000, 5, '2022-05-03'),
    (13, 'Diana Cruz',     'Brand Designer',       88000, 2, '2023-06-28'),
    (14, 'Leon Hoffmann',  'Sales Rep',            71000, 3, '2023-09-11'),
    (15, 'Aisha Osei',     'Data Analyst',        109000, 6, '2021-12-01'),
    (16, 'Tom Bradley',    'Backend Engineer',    119000, 1, '2020-03-17'),
    (17, 'Mei Lin',        'Content Strategist',   79000, 5, '2023-02-14'),
    (18, 'Carlos Reyes',   'DevOps Engineer',     128000, 1, '2022-08-08'),
    (19, 'Fatima Hassan',  'Data Scientist',      141000, 6, '2020-07-22'),
    (20, 'Lucas Petit',    'Marketing Analyst',    85000, 5, '2023-04-05');`,
  `INSERT INTO products VALUES
    (1,  'Notebook Pro',          'Hardware',  1499.00, 28),
    (2,  'Cloud IDE Seat',        'Software',    39.00, 500),
    (3,  'SQL Hoodie',            'Merch',       64.00, 72),
    (4,  'Data Pack',             'Software',   129.00, 210),
    (5,  'Mechanical Keyboard',   'Hardware',   179.00, 38),
    (6,  'USB-C Hub',             'Hardware',    49.00, 145),
    (7,  'Dev Sticker Pack',      'Merch',       12.00, 400),
    (8,  'Pro Monitor Arm',       'Hardware',   239.00, 19),
    (9,  'Team License',          'Software',   499.00, 80),
    (10, 'Noise Cancelling Headphones', 'Hardware', 349.00, 25),
    (11, 'SQL Mug',               'Merch',       18.00, 300),
    (12, 'Analytics Dashboard',   'Software',   199.00, 60),
    (13, 'Laptop Stand',          'Hardware',    89.00, 55),
    (14, 'API Access Token Pack', 'Software',    59.00, 200),
    (15, 'Ergonomic Mouse',       'Hardware',   129.00, 42);`,
  `INSERT INTO customers VALUES
    (1,  'Orbit Labs',     'ops@orbit.test',   'North America', '2023-03-11'),
    (2,  'Nova Studio',    'hello@nova.test',  'Europe',        '2022-08-21'),
    (3,  'Zenith AI',      'data@zenith.test', 'Asia Pacific',  '2024-01-15'),
    (4,  'Pixel Foundry',  'team@pixel.test',  'Europe',        '2021-05-04'),
    (5,  'Quasar Inc',     'hi@quasar.test',   'North America', '2022-11-30'),
    (6,  'Drift Co',       'hey@drift.test',   'Asia Pacific',  '2023-07-19'),
    (7,  'Apex Systems',   'yo@apex.test',     'North America', '2021-02-28'),
    (8,  'Bloom Agency',   'hi@bloom.test',    'Europe',        '2023-09-05'),
    (9,  'Spark Labs',     'hi@spark.test',    'Asia Pacific',  '2022-04-17'),
    (10, 'Crest Digital',  'hi@crest.test',    'North America', '2024-02-01'),
    (11, 'Flux Studio',    'hi@flux.test',     'Europe',        '2021-10-13'),
    (12, 'Nimbus Cloud',   'hi@nimbus.test',   'Asia Pacific',  '2023-12-22');`,
  `INSERT INTO orders VALUES
    (1,  1,  2,  18, '2024-01-22', 'paid'),
    (2,  2,  5,   4, '2024-02-03', 'shipped'),
    (3,  3,  4,   9, '2024-02-19', 'paid'),
    (4,  1,  1,   2, '2024-03-01', 'processing'),
    (5,  4,  3,  12, '2024-03-14', 'paid'),
    (6,  2,  2,  25, '2024-04-09', 'paid'),
    (7,  5,  9,   3, '2024-04-15', 'shipped'),
    (8,  6,  7,  50, '2024-04-22', 'paid'),
    (9,  7,  10,  2, '2024-05-01', 'processing'),
    (10, 3,  12,  5, '2024-05-08', 'paid'),
    (11, 8,  6,  10, '2024-05-13', 'paid'),
    (12, 5,  1,   1, '2024-05-20', 'shipped'),
    (13, 9,  4,   7, '2024-06-02', 'paid'),
    (14, 1,  14, 20, '2024-06-11', 'paid'),
    (15, 10, 8,   3, '2024-06-18', 'processing'),
    (16, 4,  11, 15, '2024-06-25', 'paid'),
    (17, 11, 2,  40, '2024-07-03', 'paid'),
    (18, 6,  13,  2, '2024-07-09', 'shipped'),
    (19, 2,  9,   1, '2024-07-15', 'paid'),
    (20, 7,  3,  20, '2024-07-21', 'paid'),
    (21, 12, 15,  4, '2024-07-28', 'processing'),
    (22, 8,  4,   6, '2024-08-04', 'paid'),
    (23, 3,  2,  30, '2024-08-10', 'paid'),
    (24, 5,  5,   2, '2024-08-16', 'shipped'),
    (25, 9,  12,  3, '2024-08-22', 'paid'),
    (26, 10, 7,  25, '2024-08-28', 'paid'),
    (27, 11, 1,   1, '2024-09-04', 'processing'),
    (28, 1,  6,   8, '2024-09-10', 'paid'),
    (29, 6,  9,   2, '2024-09-17', 'paid'),
    (30, 12, 3,  10, '2024-09-23', 'paid');`
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
  { name: "Students", accent: "from-sky-400 to-cyan-300", description: "Learners with grades, cities, and GPA scores." },
  { name: "Employees", accent: "from-violet-400 to-fuchsia-300", description: "Team members with roles, salaries, and departments." },
  { name: "Departments", accent: "from-indigo-400 to-sky-300", description: "Departments with location and budget." },
  { name: "Products", accent: "from-cyan-300 to-emerald-300", description: "Catalog items with category, price, and stock." },
  { name: "Customers", accent: "from-blue-400 to-violet-300", description: "Customer accounts with regions and signup dates." },
  { name: "Orders", accent: "from-fuchsia-400 to-sky-300", description: "Purchases connecting customers and products." }
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

export function getTablePreview(db, tableName, limit = 1000) {
  const result = db.exec(`SELECT * FROM ${tableName} LIMIT ${limit};`);
  return result[0] || { columns: [], values: [] };
}

export function getTableCount(db, tableName) {
  const result = db.exec(`SELECT COUNT(*) AS count FROM ${tableName};`);
  return result[0]?.values?.[0]?.[0] ?? 0;
}
