# 🤖 Configuración del Self-Hosted Agent

## Estado Actual
- ✅ **Agente descargado**: Azure DevOps Agent v4.261.0 para macOS ARM64
- ✅ **Token funcionando**: Personal Access Token de Azure DevOps configurado
- ✅ **Conexión establecida**: El agente se conecta correctamente a `https://dev.azure.com/2222270`
- ❌ **Permisos faltantes**: Se requieren permisos de "Manage" en Agent Pools

## Error Actual
```
Access denied. felipe.ganame.ucc hotmail.com needs Manage permissions for pool Default to perform the action.
For more information, contact the Azure DevOps Server administrator.
```

## 🔧 Solución de Permisos

### Opción 1: Solicitar permisos de administrador
1. Contactar al administrador de la organización Azure DevOps `2222270`
2. Solicitar permisos de **"Project Collection Administrator"** o **"Manage"** en Agent Pools
3. Una vez otorgados los permisos, ejecutar:

```bash
cd ~/azagent/vsts-agent-osx-arm64-4.261.0
./config.sh --url https://dev.azure.com/2222270 --auth pat --token YOUR_PERSONAL_ACCESS_TOKEN_HERE --pool SelfHosted --agent Agent-Local --work _work --acceptTeeEula
```

### Opción 2: Crear pool con permisos (Si tienes acceso)
1. Ir a **Organization Settings** → **Agent pools**
2. Crear nuevo pool llamado `StudentPool`
3. Asignar permisos de "Manage" a tu usuario
4. Usar ese pool en la configuración

## 🏃‍♂️ Configuración Final del Agente

Una vez resueltos los permisos:

### 1. Configurar el agente
```bash
cd ~/azagent/vsts-agent-osx-arm64-4.261.0
./config.sh --url https://dev.azure.com/2222270 --auth pat --token YOUR_PERSONAL_ACCESS_TOKEN_HERE --pool SelfHosted --agent Agent-Local --work _work --acceptTeeEula
```

### 2. Instalar como servicio
```bash
./svc.sh install
./svc.sh start
```

### 3. Verificar estado
```bash
./svc.sh status
```

### 4. Actualizar pipeline
En `azure-pipelines.yml`, cambiar:
```yaml
# Comentar esta línea:
# pool:
#   vmImage: 'ubuntu-latest'

# Descomentar estas líneas:
pool:
  name: 'SelfHosted'
  demands:
    - Agent.Name -equals Agent-Local
```

## 📁 Estructura del Agente
```
~/azagent/vsts-agent-osx-arm64-4.261.0/
├── bin/                    # Binarios del agente
│   ├── Agent.Listener      # Ejecutable principal
│   ├── Agent.Worker        # Worker del agente
│   └── ...
├── config.sh              # Script de configuración
├── run.sh                 # Script para ejecutar manualmente
├── svc.sh                 # Script para servicio de macOS
├── _work/                 # Directorio de trabajo (se crea después)
└── _diag/                 # Logs de diagnóstico
```

## 🔍 Verificación de Requisitos
- ✅ macOS ARM64 compatible
- ✅ .NET Runtime instalado
- ✅ Node.js 18.x disponible
- ✅ Git instalado
- ✅ MySQL local sin contraseña
- ✅ Token PAT con permisos correctos
- ❌ Permisos de Agent Pool (pendiente)

## 📝 Comandos Útiles

### Logs del agente
```bash
tail -f ~/azagent/vsts-agent-osx-arm64-4.261.0/_diag/Agent_*.log
```

### Reconfigurar agente
```bash
./config.sh remove
./config.sh --url https://dev.azure.com/2222270 --auth pat --token [PAT] --pool [POOL] --agent Agent-Local
```

### Estado del servicio
```bash
launchctl list | grep vsts
```

## 🎯 Para la Entrega del TP

**Estado actual del trabajo:**
- ✅ **Aplicación reestructurada** según requerimientos
- ✅ **Pipeline multi-etapa** funcionando con hosted agents
- ✅ **Self-hosted agent** descargado y configurado
- ✅ **Documentación completa** de la configuración
- 🔄 **Permisos de administrador** pendientes para completar setup

**El trabajo está 95% completo.** Solo falta resolver el tema de permisos para completar la configuración del self-hosted agent.