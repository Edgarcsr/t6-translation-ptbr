# Steam Fix - Evolução da Estratégia

## ❌ Abordagem 1: Launch Options (Descartada)

### O que tentamos
Modificar o arquivo `localconfig.vdf` do Steam para adicionar uma launch option customizada:
```
"LaunchOptions"  "C:\Program Files (x86)\Steam\steamapps\common\Call of Duty Black Ops II\plutonium.exe" %command%
```

### Por que não funcionou
1. **Arquivo em local imprevisível**: O arquivo `localconfig.vdf` não está em `Steam\config\`, mas sim em `Steam\userdata\<userid>\config\`
2. **Steam bloqueia durante execução**: Se o Steam está rodando, ele bloqueia o arquivo impedindo modificações
3. **Múltiplos usuários**: Sistema completo demanda encontrar e modificar config para cada usuário Steam
4. **Formatação VDF complexa**: O formato binário/texto misto do `.vdf` é frágil e fácil quebrar
5. **Steam pode reverter**: O Steam às vezes reseta as configurações sem aviso

### Código (descartado em `src-tauri/src/lib.rs`)
```rust
// Funções removidas:
// - find_steam_config()
// - update_steam_config()
```

---

## ✅ Abordagem 2: Substituição de Executáveis (Atual)

### O que fazemos
1. Fazer backup dos executáveis originais:
   - `t6mp.exe` → `.plutonium_backup/t6mp.exe`
   - `t6sp.exe` → `.plutonium_backup/t6sp.exe`
   - `t6zm.exe` → `.plutonium_backup/t6zm.exe`

2. Substituir pelo `plutonium.exe`:
   - `t6mp.exe` ← `plutonium.exe`
   - `t6sp.exe` ← `plutonium.exe`
   - `t6zm.exe` ← `plutonium.exe`

3. Ao desinstalar, restaurar do backup

### Por que funciona
✅ **Simples**: Apenas copia/move arquivos, sem manipular config  
✅ **Robusto**: Não depende de Steam estar fechado ou formato específico  
✅ **Seguro**: Backup garante reversibilidade 100%  
✅ **Universal**: Funciona independente de quantos usuários Steam tem  
✅ **Direto**: Quando Steam clica "Play", roda `plutonium.exe` naturalmente  

### Fluxo

```
┌─ Usuário clica "Play" no Steam
│
├─ Steam procura por t6mp.exe
│
├─ Encontra plutonium.exe (renomeado)
│
├─ Plutonium carrega
│
└─ Tradução PT-BR aplica automaticamente ✨
```

---

## 📋 Comparação

| Aspecto | Launch Options | Substituição |
|---------|-----------------|--------------|
| **Complexidade** | Alta (parsing VDF) | Baixa (filesystem) |
| **Confiabilidade** | ❌ Frágil | ✅ Robusta |
| **Steam aberto** | ❌ Bloqueia | ✅ Funciona |
| **Múltiplos usuários** | ❌ Requer detectar | ✅ Automático |
| **Reversibilidade** | ⚠️ Risco | ✅ Garantido |
| **Tempo de implementação** | Alto | Baixo |

---

## 🛠️ Implementação Atual

### Instalação (`steam_fix_install`)
```rust
pub async fn steam_fix_install(bo2_path: &str) -> Result<String, String> {
    // 1. Criar diretório .plutonium_backup
    // 2. Baixar plutonium.exe (local ou CDN)
    // 3. Para cada [t6mp.exe, t6sp.exe, t6zm.exe]:
    //    - Fazer backup se não existe
    //    - Substituir pela cópia do plutonium.exe
}
```

### Desinstalação (`steam_fix_uninstall`)
```rust
pub fn steam_fix_uninstall(bo2_path: &str) -> Result<String, String> {
    // 1. Restaurar cada arquivo do backup
    // 2. Remover diretório .plutonium_backup
}
```

---

## 📂 Estrutura Após Instalação

```
C:\Program Files (x86)\Steam\steamapps\common\Call of Duty Black Ops II\
├── t6mp.exe              ← Agora é plutonium.exe (cópia)
├── t6sp.exe              ← Agora é plutonium.exe (cópia)
├── t6zm.exe              ← Agora é plutonium.exe (cópia)
├── .plutonium_backup/    ← Backup dos originais
│   ├── t6mp.exe          ← Original
│   ├── t6sp.exe          ← Original
│   └── t6zm.exe          ← Original
└── ... outros arquivos
```

---

## 🎮 Experiência do Usuário

### Instalação
```
Clica: "Instalar Steam Fix"
       ↓
App baixa plutonium.exe
App faz backup de t6mp/sp/zm.exe
App copia plutonium.exe 3x
       ↓
✅ "Steam Fix instalado! Agora ao clicar Play rodará Plutonium"
```

### Uso Normal
```
Steam → Clica "Play" em BO2
       ↓
Steam procura por t6mp.exe
       ↓
Roda plutonium.exe (disfarçado de t6mp.exe)
       ↓
Plutonium carrega com tradução PT-BR
       ↓
🎮 Jogo rodando!
```

### Desinstalação
```
Clica: "Desinstalar Steam Fix"
       ↓
App restaura backup
App remove .plutonium_backup/
       ↓
✅ "Steam Fix removido! Executáveis originais restaurados"
```

---

## 🔄 Comparação com Felipe's Approach

Felipe usava:
```
1. Mod compilado (.sabl) com scripts
2. Arquivos .str em raw/ para tradução
```

Nosso approach:
```
1. Executável substituído (sem scripts)
2. Arquivos .str em raw/ para tradução
```

**Vantagem**: Mais simples, sem dependência de compilação ou mod framework.

---

## 📝 Notas Futuras

Se no futuro quisermos voltar a tentar Launch Options:
- [ ] Reescrever com melhor parsing de VDF (usar crate `vdf-rs` ou similar)
- [ ] Detectar todos os usuários e modificar cada um
- [ ] Garantir que Steam está fechado antes de modificar
- [ ] Adicionar validação do arquivo após escrita

Mas por enquanto, **substituição de executáveis é a solução definida**.

---

*Documentado em: 2026-07-14*
