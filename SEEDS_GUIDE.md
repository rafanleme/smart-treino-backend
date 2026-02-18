# Seeds Guide - SmartTreino

## Arquivos de Seed Criados ✅

- `prisma/seeds/exercises.seed.ts` - 135 exercícios (todos os grupos musculares)
- `prisma/seeds/achievements.seed.ts` - 40 conquistas (consistência, força, avaliação, marcos)
- `prisma/seeds/index.ts` - Runner principal

## Como Rodar os Seeds

### 1. Garantir que o banco está acessível

Verifique a conexão com o banco:
```bash
cd backend-node
npx prisma db pull
```

### 2. Sincronizar o schema com o banco

**Opção A: Usar `db push` (desenvolvimento)**
```bash
npx prisma db push
```

**Opção B: Criar migration (produção)**
```bash
npx prisma migrate dev --name init
```

**Se aparecer erro de shadow database:**
```bash
# Adicione ao .env:
DATABASE_URL="mysql://user:pass@host:3306/database?shadowDatabaseUrl=mysql://user:pass@host:3306/database_shadow"

# OU desabilite a shadow database no schema.prisma:
# datasource db {
#   provider = "mysql"
#   url      = env("DATABASE_URL")
#   shadowDatabaseUrl = env("SHADOW_DATABASE_URL") // opcional
# }
```

### 3. Rodar os seeds

```bash
npm run seed
```

Ou manualmente:
```bash
npx ts-node prisma/seeds/index.ts
```

## Seeds são Idempotentes ✅

Você pode rodar `npm run seed` múltiplas vezes sem duplicar dados:

- **Exercises**: Verifica se já existe pelo `name` antes de criar
- **Achievements**: Usa `upsert` com `key` única

## Verificar Dados Populados

```bash
# Abrir Prisma Studio (GUI)
npm run prisma:studio
```

Ou via SQL:
```sql
SELECT COUNT(*) FROM exercises WHERE is_custom = 0; -- Deve retornar 135
SELECT COUNT(*) FROM achievements; -- Deve retornar 40
```

## Dados Populados

### Exercícios (135 total)
- Peito: 15
- Costas: 18
- Pernas: 20
- Glúteos: 8
- Ombros: 15
- Bíceps: 12
- Tríceps: 12
- Abdômen: 15
- Antebraço: 5
- Panturrilha: 5
- Cardio: 10

### Conquistas (40 total)
- **Consistência**: 15 (first_workout, sessions_X, streak_X, weekend_warrior, early_bird, night_owl)
- **Força**: 10 (first_pr, pr_X, volume_X, total_volume_X, all_muscle_groups)
- **Avaliação**: 8 (first_assessment, assessments_X, weight_loss/gain, bf_decrease, arm_growth)
- **Marcos**: 7 (account_Xd, first_custom_exercise, first_ai_workout, workout_variety)

## Troubleshooting

### Erro: Can't reach database server
```bash
# Verificar se o banco está rodando
# Verificar credenciais no .env
# Verificar firewall/VPN
```

### Erro: Table already exists
```bash
# Resetar banco (⚠️ APAGA TUDO)
npx prisma migrate reset

# Ou apenas limpar dados e rodar seeds novamente
npx prisma db seed
```

### Erro: Unique constraint violation
```bash
# Os seeds verificam duplicatas, mas se houver erro:
# 1. Deletar dados manualmente
DELETE FROM exercises WHERE is_custom = 0;
DELETE FROM achievements;

# 2. Rodar seeds novamente
npm run seed
```

## Próximos Passos

Após rodar os seeds com sucesso:
1. ✅ Exercises e Achievements populados
2. Implementar Fase M4 (Módulo de Exercícios)
3. Testar endpoints com dados reais
