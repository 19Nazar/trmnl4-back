# trmnl4-back

## 📦 Installation & Setup

### 1️⃣ Database Setup

Run the `setup-database.sql` script in your MySQL database:

---

### 3️⃣ Install Dependencies

Using npm:

```bash
npm install
```

Or using yarn:

```bash
yarn install
```

---

### 4️⃣ Run Database Migrations

Using npm:

```bash
npm run migration:run
```

Or using yarn:

```bash
yarn migration:run
```

---

### 5️⃣ Seed the Database

Using npm:

```bash
npm run seed
```

Or using yarn:

```bash
yarn seed
```

---

### 6️⃣ Build the Project

Using npm:

```bash
npm run build
```

Or using yarn:

```bash
yarn build
```

---

### 7️⃣ Start the Production Server

Using npm:

```bash
npm run start:prod
```

Or using yarn:

```bash
yarn start:prod
```

---

## 📝 Available Scripts

| Command   | npm                     | yarn                 | Description             |
| --------- | ----------------------- | -------------------- | ----------------------- |
| Install   | `npm install`           | `yarn install`       | Install dependencies    |
| Migration | `npm run migration:run` | `yarn migration:run` | Run database migrations |
| Seed      | `npm run seed`          | `yarn seed`          | Seed the database       |
| Build     | `npm run build`         | `yarn build`         | Build for production    |
| Start     | `npm run start:prod`    | `yarn start:prod`    | Start production server |

---

## 🔧 Troubleshooting

### Database Connection Issues

- Verify your `.env` credentials are correct
- Ensure MySQL server is running
- Check if the database exists

Что бы добавил:
полную авторизацию, опитимизацию
