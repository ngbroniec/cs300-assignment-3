//Validate
export function validateRecord(record) {
  const errors = [];
 
  if (!record.id) {
    errors.push("id is required");
  }
  if (!record.title) {
    errors.push("title is required");
  }
  if (!record.creator) {
    errors.push("creator is required");
  }
  if (!record.category) {
    errors.push("category is required");
  }
 
  if (typeof record.minutes !== "number") {
    errors.push("minutes must be a number");
  } else if (isNaN(record.minutes) || record.minutes < 0) {
    errors.push("minutes must be 0 or more");
  }
 
  return { valid: errors.length === 0, errors: errors };
}

//Normalizr
export function normalizeRecord(record) {
  const copy = { ...record };
 
  if (copy.title) {
    copy.title = copy.title.trim();
  }
  if (copy.creator) {
    copy.creator = copy.creator.trim();
  }
  if (copy.category) {
    const cat = copy.category.trim().toLowerCase();
    copy.category = cat.charAt(0).toUpperCase() + cat.slice(1);
  }
 
  return copy;
}

