class JsonCat {
  is () {
    return false
  }

  valid () {
    return true
  }

  stringify (val, parent = null) {
    return String(val)
  }
}

class NullJsonCat extends JsonCat {
  is (val) {
    return val === null
  }
}

class NumberJsonCat extends JsonCat {
  is (val) {
    return typeof val === 'number'
  }
}

class StringJsonCat extends JsonCat {
  is (val) {
    return typeof val === 'string'
  }

  stringify (val) {
    return `"${val}"`
  }
}

class UndefinedJsonCat extends JsonCat {
  is (val) {
    return true
  }

  valid (val, parent = null) {
    return parent === null || Array.isArray(parent)
  }

  stringify (val, parent = null) {
    if (parent === null) return undefined
    if (Array.isArray(parent)) return null
  }
}

class BooleanJsonCat extends JsonCat {
  is (val) {
    return typeof val === 'boolean'
  }
}

class ArrayJsonCat extends JsonCat {
  is (val) {
    return Array.isArray(val)
  }

  stringify (val) {
    const str = val.map(item => stringify(item, val))
    return `[${str}]`
  }
}

class ObjJsonCat extends JsonCat {
  is (val) {
    return typeof val === 'object' && val !== null
  }

  stringify (val) {
    if (typeof Reflect.get(val, 'toJSON') === 'function') {
      val = val.toJSON()
      return stringify(val)
    }
    let res = ''
    for (const [key, value] of Object.entries(val)) {
      const cat = getCat(value, val)
      if (cat) {
        const valueStr = stringify(value, val, cat)
        if (res) {
          res += ','
        }
        res += `"${key}":${valueStr}`
      }
    }
    return `{${res}}`
  }
}

const cats = [new NullJsonCat(), new BooleanJsonCat(), new NumberJsonCat(), new StringJsonCat(), new ArrayJsonCat(), new ObjJsonCat(), new UndefinedJsonCat()]

const getCat = (val, parent = null) => {
  return cats.find(cat => cat.is(val) && cat.valid(val, parent))
}

export const stringify = (val, parent = null, cat = null) => {
  cat = cat ?? getCat(val, parent)
  return cat.stringify(val, parent)
}
