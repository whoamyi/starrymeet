# StarryMeet Categories

Complete list of celebrity categories in the database.

**Total Categories:** 31
**Parent Groups:** 5 (Entertainer, Athlete, Creator, Business, PublicFigure, Other)

---

## Categories by Parent Group

### 🎭 **Entertainer** (10 categories)
1. Actor
2. Comedian
3. Dancer
4. Film Director
5. Model
6. Musician
7. Producer
8. Rapper
9. Singer
10. Writer/Author (under Entertainer)

### ⚽ **Athlete** (9 categories)
1. American Football Player
2. Baseball Player
3. Basketball Player
4. Boxer
5. Golfer
6. MMA Fighter
7. Racing Driver
8. Soccer Player
9. Tennis Player

### 🎥 **Creator** (5 categories)
1. Content Creator
2. Photographer
3. Podcaster
4. Social Media Influencer
5. YouTuber

### 💼 **Business** (4 categories)
1. Author
2. Chef
3. Entrepreneur
4. Journalist

### 🏛️ **PublicFigure** (3 categories)
1. Politician
2. Public Figure
3. TV Host

### 📦 **Other** (1 category)
1. Other

---

## All Categories (Alphabetical)

| ID | Category Name            | Parent Group  | Slug                     |
|----|--------------------------|---------------|--------------------------|
| 32 | Actor                    | Entertainer   | actor                    |
| 44 | American Football Player | Athlete       | american-football-player |
| 56 | Author                   | Business      | author                   |
| 45 | Baseball Player          | Athlete       | baseball-player          |
| 42 | Basketball Player        | Athlete       | basketball-player        |
| 46 | Boxer                    | Athlete       | boxer                    |
| 57 | Chef                     | Business      | chef                     |
| 36 | Comedian                 | Entertainer   | comedian                 |
| 52 | Content Creator          | Creator       | content-creator          |
| 40 | Dancer                   | Entertainer   | dancer                   |
| 55 | Entrepreneur             | Business      | entrepreneur             |
| 37 | Film Director            | Entertainer   | film-director            |
| 48 | Golfer                   | Athlete       | golfer                   |
| 58 | Journalist               | Business      | journalist               |
| 47 | MMA Fighter              | Athlete       | mma-fighter              |
| 39 | Model                    | Entertainer   | model                    |
| 34 | Musician                 | Entertainer   | musician                 |
| 62 | Other                    | Other         | other                    |
| 54 | Photographer             | Creator       | photographer             |
| 53 | Podcaster                | Creator       | podcaster                |
| 59 | Politician               | PublicFigure  | politician               |
| 38 | Producer                 | Entertainer   | producer                 |
| 61 | Public Figure            | PublicFigure  | public-figure            |
| 49 | Racing Driver            | Athlete       | racing-driver            |
| 35 | Rapper                   | Entertainer   | rapper                   |
| 33 | Singer                   | Entertainer   | singer                   |
| 41 | Soccer Player            | Athlete       | soccer-player            |
| 51 | Social Media Influencer  | Creator       | influencer               |
| 60 | TV Host                  | PublicFigure  | tv-host                  |
| 43 | Tennis Player            | Athlete       | tennis-player            |
| 50 | YouTuber                 | Creator       | youtuber                 |

---

## Category Usage Statistics

To get celebrity counts per category, run:

```sql
SELECT
  c.name as category,
  c.parent_category,
  COUNT(cn.id) as total_celebrities
FROM categories c
LEFT JOIN celebrities_new cn ON c.id = cn.category_id
  AND cn.status = 'active'
GROUP BY c.id, c.name, c.parent_category
ORDER BY total_celebrities DESC;
```

---

## Notes

- Categories are hierarchical with parent groups for filtering
- Each celebrity can belong to only one category
- Slugs are URL-friendly versions for routing
- Parent categories help organize browse/filter UI
