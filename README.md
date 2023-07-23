# Unity Package Manager Version Increment

This action reads and/or increments a Unity package.json file.

## Inputs

### `path`

**Required** Path to the Unity Package JSON file. Default `"package.json"`.
   
### `increment`

**Required** Which part of the version number to increment: major|minor|patch|none. Default `"none"`.

## Outputs

### `version`

The resulting version number. If "none" is provided as the `increment` value you get the current version as read from the package.json file.

## Example usage

```yaml
- name: Increment version
  id: increment-version
  uses: williamrjackson/upm_version_increment_action@v1.0.0
  with: 
    path: package.json
    increment: patch

- name: Print incremented
  run: echo ${{ steps.increment-version.outputs.version }}
```
