# Decisiones del TP01
## Configuración de identidad
Para este trabajo práctico configuré mi identidad de Git de la siguiente forma:
```bash
git config --global user.name "ArnonNahmias"
git config --global user.email "2222270@ucc.edu.ar"
git config --global init.defaultBranch main




## Estrategia de desarrollo

Usamos una **rama nueva** (`feature/nueva-funcionalidad`) para no trabajar directo en `main` y así mantenerlo siempre estable.  
Hicimos **commits atómicos** para que cada cambio sea pequeño, claro y fácil de revisar o revertir si hace falta.



## Estrategia para el hotfix
Se simuló un bug en la rama `main` y se corrigió en la rama `hotfix/readme-bug`.
- El fix se integró a `main` con `merge --no-ff` para que quede un commit de merge visible en el historial.  
- Luego llevé el fix a la rama `feature/nueva-funcionalidad` usando `cherry-pick`, porque quería aplicar **solo el commit del fix** sin traer todo el historial de `main`.  
- Durante el cherry-pick apareció un conflicto en `README.md`. Lo resolví combinando los cambios y continuando con `git cherry-pick --continue`.  
