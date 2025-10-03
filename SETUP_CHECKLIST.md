# Setup Checklist for Team Members

## ✅ Prerequisites

### Обязательные инструменты:

- [ ] **Docker Desktop** - для запуска PostgreSQL
  - Скачать: https://www.docker.com/products/docker-desktop
  - После установки запустите Docker Desktop
  ```bash
  # Проверить установлен ли Docker
  docker --version
  ```

- [ ] **Bun runtime** - JavaScript/TypeScript runtime (заменяет npm/node)
  ```bash
  # Установка Bun
  curl -fsSL https://bun.sh/install | bash

  # После установки перезагрузите терминал или выполните
  source ~/.zshrc  # для zsh
  # или
  source ~/.bashrc # для bash

  # Проверить установлен ли Bun
  bun --version
  ```

- [ ] **LiteLLM API ключ** - получите от администратора

## ✅ Быстрая установка (3 шага)

**🎯 Все автоматизировано:**
- Один скрипт для первоначальной настройки
- Автоматическая установка зависимостей
- Автоматический запуск и настройка PostgreSQL
- Автоматическая инициализация базы данных

### Шаг 1: Клонирование и установка
```bash
git clone <repository-url>
cd codebuff
./setup.sh
```

**Скрипт setup.sh автоматически:**
- Создаст `.env` файл из `.env.example`
- Установит все зависимости через `bun install`
- Запустит PostgreSQL в Docker
- Инициализирует базу данных

### Шаг 2: Настройка API ключа
```bash
nano .env
```

**Установите ОБЯЗАТЕЛЬНО:**
```bash
OPEN_ROUTER_API_KEY=sk-your-actual-litellm-api-key
```

**Опционально (для тестирования других серверов/моделей):**
```bash
# Использовать другой LiteLLM сервер
LITELLM_BASE_URL=https://another-litellm.example.com/v1

# Тестировать другую модель
DEFAULT_MODEL=anthropic/claude-sonnet-4.5
```

**ВАЖНО:** Все остальные переменные уже настроены для локальной разработки!

### Шаг 3: Запуск (2 терминала)

**Terminal 1 - Backend:**
```bash
./start-backend.sh
```

**Terminal 2 - CLI:**
```bash
./start-cli.sh
```

**Готово! 🎉** Теперь можно работать с CLI.

## ✅ Verification Tests

После запуска проверьте:

- [ ] CLI подключился к backend без ошибок
- [ ] Можете отправить простой prompt (например "hello")
- [ ] AI отвечает используя qwen3-coder модель
- [ ] ESC останавливает ответ AI
- [ ] `--cwd /path/to/project` работает без ошибки "Agent template not found"
- [ ] AI может читать файлы в проекте
- [ ] AI может изменять файлы в проекте

## ✅ Решение проблем

### "Could not connect. Retrying..."

**Причина:** Backend не запущен

**Решение:**
```bash
./start-backend.sh
```

### "Agent template not found for type: base"

**Причина:** Backend нужно перезапустить

**Решение:**
```bash
./restart-backend.sh
```

### Backend не запускается

**Причина:** PostgreSQL не запущен или .env не настроен

**Решение:**
```bash
# Перезапустить PostgreSQL
docker compose down
docker compose up -d

# Или запустить полную установку заново
./setup.sh
```

## ✅ Ежедневная работа

### Запуск (2 команды)
```bash
# Terminal 1: Backend
./start-backend.sh

# Terminal 2: CLI
./start-cli.sh
```

### Перезапуск backend (если нужно)
```bash
./restart-backend.sh
```

### Остановка
```bash
# Stop CLI: Ctrl+C (дважды в Terminal 2)
# Stop Backend: Ctrl+C (в Terminal 1)
```

## ✅ What You Need to Know

### Environment Variables
**ОБЯЗАТЕЛЬНО:**
- `OPEN_ROUTER_API_KEY` - ваш LiteLLM API ключ

**ОПЦИОНАЛЬНО (для кастомизации):**
- `LITELLM_BASE_URL` - URL LiteLLM сервера (по умолчанию: `https://your-litellm-server.example.com/v1`)
- `DEFAULT_MODEL` - модель для использования (по умолчанию: `openrouter/qwen/qwen3-coder`)

**Все остальное работает с dummy значениями из `.env.example`**

### Model
По умолчанию используется **qwen3-coder** через LiteLLM endpoint.
Можно легко изменить через переменную `DEFAULT_MODEL` в `.env`.

### Database
Локальная PostgreSQL база с тестовым пользователем и 1,000,000 кредитов.

### Agents
Базовые агенты загружаются из `.agents/` директории автоматически.

## ✅ Files You Should NOT Modify

Если не обсуждалось с командой, НЕ меняйте:
- `backend/src/llm-apis/vercel-ai-sdk/openrouter.ts`
- `packages/internal/src/openrouter-ai-sdk/*`
- `common/src/old-constants.ts` (getModelForMode функция)
- `.env` (кроме OPEN_ROUTER_API_KEY)

## ✅ Need Help?

1. Проверьте `CHANGES_SUMMARY.md` для понимания изменений
2. Обратитесь к администратору за LiteLLM API ключом
3. Спросите команду в чате

## ✅ Справочник по скриптам

### Основные скрипты (в корне репозитория)

| Скрипт | Назначение |
|--------|------------|
| `./setup.sh` | Первоначальная установка всего окружения |
| `./start-backend.sh` | Запуск backend сервера |
| `./restart-backend.sh` | Перезапуск backend сервера |
| `./start-cli.sh` | Запуск CLI |

### Использование

```bash
# Первоначальная установка (только один раз)
./setup.sh

# Ежедневная работа
./start-backend.sh          # Terminal 1
./start-cli.sh              # Terminal 2

# Перезапуск backend при необходимости
./restart-backend.sh

# Запуск CLI в другой директории
./start-cli.sh --cwd /path/to/project

# Полный сброс окружения (если что-то сломалось)
docker compose down -v
./setup.sh
```

### Что делают скрипты

**setup.sh:**
- Создает `.env` из `.env.example`
- Устанавливает зависимости
- Запускает PostgreSQL
- Инициализирует базу данных

**start-backend.sh:**
- Проверяет наличие `.env`
- Проверяет PostgreSQL (запускает если нужно)
- Запускает backend сервер

**restart-backend.sh:**
- Останавливает запущенные процессы backend
- Запускает свежий экземпляр

**start-cli.sh:**
- Устанавливает переменные окружения
- Запускает CLI
- Передает аргументы (например `--cwd`)
