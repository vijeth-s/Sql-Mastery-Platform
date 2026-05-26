export const challenges = [
  {
    id: "ch_01",
    title: "Top GPA Students",
    difficulty: "Easy",
    description: "List the name and GPA of the top 3 students, ordered by GPA from highest to lowest.",
    hint: "Use ORDER BY with DESC, then LIMIT.",
    solution: "SELECT name, gpa FROM students ORDER BY gpa DESC LIMIT 3;",
    expectedColumns: ["name", "gpa"],
    expectedRows: [["Emma Martinez", 3.95], ["Ava Patel", 3.9], ["Charlotte Hall", 3.88]]
  },
  {
    id: "ch_02",
    title: "Paid Orders Only",
    difficulty: "Easy",
    description: "Show all order IDs and their status where the status is paid.",
    hint: "Use WHERE with a string equality check.",
    solution: "SELECT id, status FROM orders WHERE status = 'paid';",
    expectedColumns: ["id", "status"],
    expectedRows: [[1, "paid"], [3, "paid"], [5, "paid"], [6, "paid"], [8, "paid"], [10, "paid"], [11, "paid"], [13, "paid"], [14, "paid"], [16, "paid"], [17, "paid"], [19, "paid"], [20, "paid"], [22, "paid"], [23, "paid"], [25, "paid"], [26, "paid"], [28, "paid"], [29, "paid"], [30, "paid"]]
  },
  {
    id: "ch_03",
    title: "Products Under 100",
    difficulty: "Easy",
    description: "Find the name and price of all products that cost less than 100.",
    hint: "Use WHERE with a less-than comparison on the price column.",
    solution: "SELECT name, price FROM products WHERE price < 100;",
    expectedColumns: ["name", "price"],
    expectedRows: [["Cloud IDE Seat", 39], ["SQL Hoodie", 64], ["USB-C Hub", 49], ["Dev Sticker Pack", 12], ["SQL Mug", 18], ["Laptop Stand", 89], ["API Access Token Pack", 59]]
  },
  {
    id: "ch_04",
    title: "Count All Students",
    difficulty: "Easy",
    description: "Return a single number: the total count of rows in the students table.",
    hint: "Use COUNT(*).",
    solution: "SELECT COUNT(*) AS total FROM students;",
    expectedColumns: ["total"],
    expectedRows: [[20]]
  },
  {
    id: "ch_05",
    title: "Engineering Employees",
    difficulty: "Easy",
    description: "List names of employees who work in department_id 1.",
    hint: "Filter using WHERE on department_id.",
    solution: "SELECT name FROM employees WHERE department_id = 1;",
    expectedColumns: ["name"],
    expectedRows: [["Iris Morgan"], ["Theo Wright"], ["Sam Okafor"], ["Tom Bradley"], ["Carlos Reyes"]]
  },
  {
    id: "ch_06",
    title: "Austin Honor Students",
    difficulty: "Easy",
    description: "Show the name and GPA for students in Austin with a GPA of at least 3.5.",
    hint: "Use WHERE with AND.",
    solution: "SELECT name, gpa FROM students WHERE city = 'Austin' AND gpa >= 3.5;",
    expectedColumns: ["name", "gpa"],
    expectedRows: [["Ava Patel", 3.9], ["Ethan Davis", 3.7], ["Amelia White", 3.6]]
  },
  {
    id: "ch_07",
    title: "Product Category Counts",
    difficulty: "Easy",
    description: "Count how many products exist in each category.",
    hint: "Use GROUP BY category.",
    solution: "SELECT category, COUNT(*) AS product_count FROM products GROUP BY category;",
    expectedColumns: ["category", "product_count"],
    expectedRows: [["Hardware", 7], ["Merch", 3], ["Software", 5]]
  },
  {
    id: "ch_08",
    title: "Department Headcount",
    difficulty: "Medium",
    description: "Show each department name alongside the number of employees in it.",
    hint: "JOIN employees to departments, then GROUP BY department name.",
    solution: "SELECT departments.name, COUNT(employees.id) AS headcount FROM departments LEFT JOIN employees ON departments.id = employees.department_id GROUP BY departments.name;",
    expectedColumns: ["name", "headcount"],
    expectedRows: [["Data Science", 4], ["Design", 3], ["Engineering", 5], ["Marketing", 3], ["Operations", 2], ["Sales", 3]]
  },
  {
    id: "ch_09",
    title: "Average Salary by Department",
    difficulty: "Medium",
    description: "Return each department name and the average salary of its employees, rounded to 2 decimals.",
    hint: "Use AVG() with GROUP BY and ROUND().",
    solution: "SELECT departments.name, ROUND(AVG(employees.salary), 2) AS avg_salary FROM departments JOIN employees ON departments.id = employees.department_id GROUP BY departments.name;",
    expectedColumns: ["name", "avg_salary"],
    expectedRows: [["Data Science", 133250], ["Design", 92666.67], ["Engineering", 123600], ["Marketing", 89000], ["Operations", 89500], ["Sales", 85333.33]]
  },
  {
    id: "ch_10",
    title: "Top Customer Totals",
    difficulty: "Medium",
    description: "For each customer, calculate total spend and return the top 5 customers by spend.",
    hint: "JOIN orders, customers, and products. Multiply price by quantity, then SUM.",
    solution: "SELECT customers.name, ROUND(SUM(products.price * orders.quantity), 2) AS total_spent FROM orders JOIN customers ON customers.id = orders.customer_id JOIN products ON products.id = orders.product_id GROUP BY customers.name ORDER BY total_spent DESC LIMIT 5;",
    expectedColumns: ["name", "total_spent"],
    expectedRows: [["Orbit Labs", 5272], ["Quasar Inc", 3354], ["Zenith AI", 3326], ["Flux Studio", 3059], ["Nova Studio", 2190]]
  },
  {
    id: "ch_11",
    title: "Above Average Salary",
    difficulty: "Medium",
    description: "List the names and salaries of employees who earn more than the overall average salary.",
    hint: "Use a subquery: WHERE salary > (SELECT AVG(salary) FROM employees).",
    solution: "SELECT name, salary FROM employees WHERE salary > (SELECT AVG(salary) FROM employees);",
    expectedColumns: ["name", "salary"],
    expectedRows: [["Iris Morgan", 124000], ["Nora Singh", 111000], ["Theo Wright", 132000], ["Sam Okafor", 115000], ["Priya Nair", 138000], ["Chloe Dupont", 145000], ["Aisha Osei", 109000], ["Tom Bradley", 119000], ["Carlos Reyes", 128000], ["Fatima Hassan", 141000]]
  },
  {
    id: "ch_12",
    title: "Order Status Counts",
    difficulty: "Medium",
    description: "Count how many orders exist for each status.",
    hint: "GROUP BY the status column.",
    solution: "SELECT status, COUNT(*) AS order_count FROM orders GROUP BY status;",
    expectedColumns: ["status", "order_count"],
    expectedRows: [["paid", 20], ["processing", 5], ["shipped", 5]]
  },
  {
    id: "ch_13",
    title: "Revenue by Region",
    difficulty: "Medium",
    description: "Show each customer region and its total revenue from all orders.",
    hint: "JOIN customers and products through orders, then GROUP BY region.",
    solution: "SELECT customers.region, ROUND(SUM(products.price * orders.quantity), 2) AS revenue FROM orders JOIN customers ON customers.id = orders.customer_id JOIN products ON products.id = orders.product_id GROUP BY customers.region;",
    expectedColumns: ["region", "revenue"],
    expectedRows: [["Asia Pacific", 7758], ["Europe", 7551], ["North America", 11621]]
  },
  {
    id: "ch_14",
    title: "High Volume Products",
    difficulty: "Medium",
    description: "Find products with more than 20 total units ordered.",
    hint: "SUM order quantity per product and filter groups with HAVING.",
    solution: "SELECT products.name, SUM(orders.quantity) AS total_quantity FROM products JOIN orders ON products.id = orders.product_id GROUP BY products.name HAVING total_quantity > 20;",
    expectedColumns: ["name", "total_quantity"],
    expectedRows: [["Cloud IDE Seat", 113], ["SQL Hoodie", 42], ["Data Pack", 22], ["Dev Sticker Pack", 75]]
  },
  {
    id: "ch_15",
    title: "Top Salary per Department",
    difficulty: "Hard",
    description: "Return the highest-paid employee in each department using a window function.",
    hint: "Use RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) inside a CTE.",
    solution: "WITH ranked AS (SELECT departments.name AS department, employees.name AS employee, employees.salary, RANK() OVER (PARTITION BY employees.department_id ORDER BY employees.salary DESC) AS salary_rank FROM employees JOIN departments ON departments.id = employees.department_id) SELECT department, employee, salary FROM ranked WHERE salary_rank = 1;",
    expectedColumns: ["department", "employee", "salary"],
    expectedRows: [["Engineering", "Theo Wright", 132000], ["Design", "Marco Silva", 98000], ["Sales", "Nora Singh", 111000], ["Operations", "Raj Mehta", 97000], ["Marketing", "Finn O'Brien", 103000], ["Data Science", "Chloe Dupont", 145000]]
  },
  {
    id: "ch_16",
    title: "Monthly Order Count",
    difficulty: "Hard",
    description: "Show the month as YYYY-MM and the number of orders placed in that month.",
    hint: "Use STRFTIME('%Y-%m', order_date) to extract the month in SQLite.",
    solution: "SELECT STRFTIME('%Y-%m', order_date) AS month, COUNT(*) AS order_count FROM orders GROUP BY month;",
    expectedColumns: ["month", "order_count"],
    expectedRows: [["2024-01", 1], ["2024-02", 2], ["2024-03", 2], ["2024-04", 3], ["2024-05", 4], ["2024-06", 4], ["2024-07", 5], ["2024-08", 5], ["2024-09", 4]]
  },
  {
    id: "ch_17",
    title: "CTE: Top Spender per Region",
    difficulty: "Hard",
    description: "Using a CTE, find the single highest-spending customer in each region.",
    hint: "Build a CTE that calculates total_spent per customer, then rank customers inside each region.",
    solution: "WITH spend AS (SELECT customers.name, customers.region, SUM(products.price * orders.quantity) AS total_spent FROM orders JOIN customers ON customers.id = orders.customer_id JOIN products ON products.id = orders.product_id GROUP BY customers.id), ranked AS (SELECT region, name, total_spent, RANK() OVER (PARTITION BY region ORDER BY total_spent DESC) AS spend_rank FROM spend) SELECT region, name, ROUND(total_spent, 2) AS top_spend FROM ranked WHERE spend_rank = 1;",
    expectedColumns: ["region", "name", "top_spend"],
    expectedRows: [["Asia Pacific", "Zenith AI", 3326], ["Europe", "Flux Studio", 3059], ["North America", "Orbit Labs", 5272]]
  },
  {
    id: "ch_18",
    title: "Rank Customers by Spend",
    difficulty: "Hard",
    description: "Rank customers by total spend and return the top 5 with their rank.",
    hint: "Aggregate spend in a CTE, then use ROW_NUMBER() OVER (ORDER BY total_spent DESC).",
    solution: "WITH spend AS (SELECT customers.name, SUM(products.price * orders.quantity) AS total_spent FROM orders JOIN customers ON customers.id = orders.customer_id JOIN products ON products.id = orders.product_id GROUP BY customers.id), ranked AS (SELECT name, ROUND(total_spent, 2) AS total_spent, ROW_NUMBER() OVER (ORDER BY total_spent DESC) AS spend_rank FROM spend) SELECT name, total_spent, spend_rank FROM ranked WHERE spend_rank <= 5;",
    expectedColumns: ["name", "total_spent", "spend_rank"],
    expectedRows: [["Orbit Labs", 5272, 1], ["Quasar Inc", 3354, 2], ["Zenith AI", 3326, 3], ["Flux Studio", 3059, 4], ["Nova Studio", 2190, 5]]
  },
  {
    id: "ch_19",
    title: "Salary Bands",
    difficulty: "Hard",
    description: "Group employees into salary bands and count how many employees are in each band.",
    hint: "Use CASE to produce High, Medium, and Low, then GROUP BY that result.",
    solution: "SELECT CASE WHEN salary >= 120000 THEN 'High' WHEN salary >= 90000 THEN 'Medium' ELSE 'Low' END AS salary_band, COUNT(*) AS employee_count FROM employees GROUP BY salary_band;",
    expectedColumns: ["salary_band", "employee_count"],
    expectedRows: [["High", 6], ["Medium", 8], ["Low", 6]]
  },
  {
    id: "ch_20",
    title: "Monthly Paid Revenue",
    difficulty: "Hard",
    description: "Show paid-order revenue by month, using YYYY-MM as the month format.",
    hint: "Filter to paid orders, multiply price by quantity, and group by STRFTIME('%Y-%m', order_date).",
    solution: "SELECT STRFTIME('%Y-%m', orders.order_date) AS month, ROUND(SUM(products.price * orders.quantity), 2) AS paid_revenue FROM orders JOIN products ON products.id = orders.product_id WHERE orders.status = 'paid' GROUP BY month;",
    expectedColumns: ["month", "paid_revenue"],
    expectedRows: [["2024-01", 702], ["2024-02", 1161], ["2024-03", 768], ["2024-04", 1575], ["2024-05", 1485], ["2024-06", 2353], ["2024-07", 3339], ["2024-08", 2841], ["2024-09", 2030]]
  }
];

function buildTierChallenges(tierId, label, sourceDifficulty, count = 25) {
  const source = challenges.filter((challenge) => challenge.difficulty === sourceDifficulty);

  return Array.from({ length: count }, (_, index) => {
    const template = source[index % source.length];
    const round = Math.floor(index / source.length) + 1;
    return {
      ...template,
      id: `${tierId}_${String(index + 1).padStart(2, "0")}`,
      title: round === 1 ? template.title : `${template.title} ${round}`,
      difficulty: label
    };
  });
}

export const challengeTiers = [
  {
    id: "easy",
    label: "Easy",
    accent: "emerald",
    description: "Start with filters, counts, simple sorting, and small grouped results.",
    challenges: buildTierChallenges("easy", "Easy", "Easy")
  },
  {
    id: "normal",
    label: "Normal",
    accent: "amber",
    description: "Practice joins, grouped summaries, subqueries, and business metrics.",
    challenges: buildTierChallenges("normal", "Normal", "Medium")
  },
  {
    id: "hard",
    label: "Hard",
    accent: "rose",
    description: "Take on CTEs, windows, monthly metrics, ranking, and CASE logic.",
    challenges: buildTierChallenges("hard", "Hard", "Hard")
  }
];
