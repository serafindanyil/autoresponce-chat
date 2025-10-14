# useDebounce Hook

## Опис

Custom React hook для debouncing (затримки) значень. Корисний для оптимізації performance при частих змінах (input, scroll, resize).

## Розташування

```
src/shared/hooks/use-debounce.ts
```

## Використання

### Базове використання

```typescript
import { useState } from "react";
import { useDebounce } from "@/shared/hooks";

const SearchComponent = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const debouncedSearchTerm = useDebounce(searchTerm, 500);

	// Цей effect спрацює тільки коли користувач перестане друкувати на 500ms
	useEffect(() => {
		console.log("Searching for:", debouncedSearchTerm);
		// API call, filtering, тощо
	}, [debouncedSearchTerm]);

	return (
		<input
			value={searchTerm}
			onChange={(e) => setSearchTerm(e.target.value)}
			placeholder="Search..."
		/>
	);
};
```

### З API запитами

```typescript
const SearchUsers = () => {
	const [query, setQuery] = useState("");
	const debouncedQuery = useDebounce(query, 300);

	useEffect(() => {
		if (debouncedQuery) {
			fetchUsers(debouncedQuery);
		}
	}, [debouncedQuery]);

	return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
};
```

### З фільтрацією

```typescript
const FilteredList = () => {
	const [filter, setFilter] = useState("");
	const debouncedFilter = useDebounce(filter, 200);

	const filteredItems = useMemo(() => {
		return items.filter((item) =>
			item.name.toLowerCase().includes(debouncedFilter.toLowerCase())
		);
	}, [items, debouncedFilter]);

	return (
		<>
			<input value={filter} onChange={(e) => setFilter(e.target.value)} />
			{filteredItems.map((item) => (
				<div key={item.id}>{item.name}</div>
			))}
		</>
	);
};
```

## API

### Parameters

| Parameter | Type     | Default | Опис                            |
| --------- | -------- | ------- | ------------------------------- |
| `value`   | `T`      | Required | Значення для debounce           |
| `delay`   | `number` | `500`   | Затримка в мілісекундах         |

### Returns

| Type | Опис                                    |
| ---- | --------------------------------------- |
| `T`  | Debounced значення (оновлюється після delay) |

## Переваги

### Performance
```typescript
// ❌ Without debounce - 10 filter operations
onChange={(e) => filterResults(e.target.value)}

// ✅ With debounce - 1 filter operation
const debouncedValue = useDebounce(value, 300);
useEffect(() => filterResults(debouncedValue), [debouncedValue]);
```

### Менше API Calls
```typescript
// ❌ Without debounce - 10 API calls
useEffect(() => {
	fetchData(searchTerm);
}, [searchTerm]);

// ✅ With debounce - 1 API call
const debouncedSearchTerm = useDebounce(searchTerm, 500);
useEffect(() => {
	fetchData(debouncedSearchTerm);
}, [debouncedSearchTerm]);
```

## Приклади Використання

### 1. Search (useSearchChats)

```typescript
export const useSearchChats = () => {
	const { chats } = useChats();
	const [searchQuery, setSearchQuery] = useState("");
	
	// Debounce для performance
	const debouncedSearchQuery = useDebounce(searchQuery, 300);

	const filteredChats = useMemo(() => {
		if (!debouncedSearchQuery.trim()) {
			return chats;
		}

		const query = debouncedSearchQuery.toLowerCase().trim();
		return chats.filter((chat) => {
			const fullName = `${chat.firstName} ${chat.lastName}`.toLowerCase();
			return fullName.includes(query);
		});
	}, [chats, debouncedSearchQuery]);

	return { searchQuery, setSearchQuery, filteredChats };
};
```

### 2. Auto-save

```typescript
const AutoSaveForm = () => {
	const [formData, setFormData] = useState({});
	const debouncedFormData = useDebounce(formData, 1000);

	useEffect(() => {
		// Auto-save 1 секунду після останньої зміни
		saveToServer(debouncedFormData);
	}, [debouncedFormData]);

	return <form>...</form>;
};
```

### 3. Window Resize

```typescript
const ResponsiveComponent = () => {
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	const debouncedWidth = useDebounce(windowWidth, 200);

	useEffect(() => {
		const handleResize = () => setWindowWidth(window.innerWidth);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		// Heavy calculation тільки після resize
		recalculateLayout(debouncedWidth);
	}, [debouncedWidth]);
};
```

### 4. Scroll Events

```typescript
const InfiniteScroll = () => {
	const [scrollPosition, setScrollPosition] = useState(0);
	const debouncedScrollPosition = useDebounce(scrollPosition, 300);

	useEffect(() => {
		const handleScroll = () => setScrollPosition(window.scrollY);
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		if (debouncedScrollPosition > threshold) {
			loadMoreItems();
		}
	}, [debouncedScrollPosition]);
};
```

## Delay Recommendations

| Use Case          | Recommended Delay | Причина                          |
| ----------------- | ----------------- | -------------------------------- |
| Search            | 300-500ms         | Швидкий feedback                 |
| Auto-save         | 1000-2000ms       | Уникнути частих saves            |
| Window resize     | 200-300ms         | Balance між smooth та performance |
| Scroll events     | 100-200ms         | Smooth scrolling experience      |
| API autocomplete  | 300-500ms         | Reduce server load               |

## Implementation Details

### Cleanup

Hook автоматично очищує timeout при unmount або зміні value:

```typescript
useEffect(() => {
	const timeoutId = setTimeout(() => {
		setDebouncedValue(value);
	}, delay);

	// ✅ Cleanup - cancel timeout якщо value змінився
	return () => {
		clearTimeout(timeoutId);
	};
}, [value, delay]);
```

### TypeScript Support

Повна type safety з generics:

```typescript
const debouncedString = useDebounce<string>("hello", 500); // string
const debouncedNumber = useDebounce<number>(42, 500);      // number
const debouncedObject = useDebounce({ name: "John" }, 500); // object
```

## Best Practices

### ✅ DO

```typescript
// Використовуй для costly operations
const debouncedSearch = useDebounce(searchQuery, 300);
useEffect(() => {
	expensiveFilterOperation(debouncedSearch);
}, [debouncedSearch]);

// Зберігай immediate value для UI
<input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />

// Використовуй з useMemo
const filteredData = useMemo(() => {
	return filter(data, debouncedValue);
}, [data, debouncedValue]);
```

### ❌ DON'T

```typescript
// Не debounce кожне значення
const debouncedCount = useDebounce(count, 500); // ❌ Непотрібно

// Не використовуй для critical UI updates
const debouncedButtonText = useDebounce(buttonText, 500); // ❌ Lag

// Не забувай про immediate feedback
<input value={debouncedValue} /> // ❌ Lag при друкуванні
```

## Related

- `useSearchChats` - використовує debounce для пошуку
- Search component - immediate value в input, debounced для фільтрації

## Performance Metrics

```
Without debounce:
- 10 keypresses = 10 filter operations
- Each operation: ~1-5ms
- Total: 10-50ms + re-renders

With debounce (300ms):
- 10 keypresses = 1 filter operation
- Delay: 300ms
- Total: 1-5ms + 1 re-render
- 10x less operations! 🚀
```
