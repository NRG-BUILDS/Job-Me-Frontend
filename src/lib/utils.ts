import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export function convertToFormData(obj: Record<string, any>): FormData {
//   const fd = new FormData();

//   function appendToFormData(data: any, parentKey = "") {
//     Object.keys(data).forEach((key) => {
//       const value = data[key];
//       const formKey = parentKey ? `${parentKey}.${key}` : key;

//       if (value instanceof File) {
//         fd.append(formKey, value);
//       } else if (Array.isArray(value)) {
//         // Handle arrays - append each item separately
//         value.forEach((item, index) => {
//           if (typeof item === "object" && !(item instanceof File)) {
//             appendToFormData(item, `${formKey}[${index}]`);
//           } else {
//             fd.append(formKey, item);
//           }
//         });
//       } else if (typeof value === "object" && value !== null) {
//         // Recursively handle nested objects
//         appendToFormData(value, formKey);
//       } else if (value !== null && value !== undefined) {
//         fd.append(formKey, value);
//       }
//     });
//   }

//   appendToFormData(obj);
//   return fd;
// }

// export function convertToFormData(obj: Record<string, any>): FormData {
//   const fd = new FormData();

//   Object.keys(obj).forEach((key) => {
//     const value = obj[key];

//     if (value === null || value === undefined) {
//       return; // Skip null/undefined values
//     }

//     // Handle File objects
//     if (value instanceof File) {
//       fd.append(key, value);
//       return;
//     }

//     // Handle File arrays (like images)
//     if (Array.isArray(value) && value.length > 0 && value[0] instanceof File) {
//       value.forEach((file) => {
//         fd.append(key, file); // All files use the same key name
//       });
//       return;
//     }

//     // Handle primitive arrays (like amenities: number[])
//     if (
//       Array.isArray(value) &&
//       value.every((item) => typeof item !== "object")
//     ) {
//       value.forEach((item, index) => {
//         fd.append(`${key}[${index}]`, String(item));
//       });
//       return;
//     }

//     // Handle arrays of objects (like extra_costs)
//     if (
//       Array.isArray(value) &&
//       value.some((item) => typeof item === "object")
//     ) {
//       value.forEach((item, index) => {
//         if (typeof item === "object" && item !== null) {
//           Object.keys(item).forEach((subKey) => {
//             fd.append(`${key}[${index}][${subKey}]`, String(item[subKey]));
//           });
//         } else {
//           fd.append(`${key}[${index}]`, String(item));
//         }
//       });
//       return;
//     }

//     // Handle nested objects (like address)
//     if (typeof value === "object" && value !== null) {
//       // Option 1: Serialize as JSON string (recommended)
//       fd.append(key, JSON.stringify(value));

//       // Option 2: Flatten with dot notation (uncomment if preferred)
//       // Object.keys(value).forEach(subKey => {
//       //   fd.append(`${key}.${subKey}`, String(value[subKey]));
//       // });
//       return;
//     }

//     // Handle primitives (string, number, boolean)
//     fd.append(key, String(value));
//   });

//   return fd;
// }

export function convertToFormData(obj: Record<string, any>): FormData {
  const fd = new FormData();

  Object.keys(obj).forEach((key) => {
    const value = obj[key];

    if (value === null || value === undefined) {
      return;
    }

    // Handle File objects
    if (value instanceof File) {
      fd.append(key, value);
      return;
    }

    // Handle File arrays
    if (Array.isArray(value) && value.length > 0 && value[0] instanceof File) {
      value.forEach((file) => {
        fd.append(key, file);
      });
      return;
    }

    // Special handling for address object
    if (
      key === "address" &&
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value)
    ) {
      Object.keys(value).forEach((addressKey) => {
        if (value[addressKey] !== null && value[addressKey] !== undefined) {
          // Try bracket notation if dot notation doesn't work
          fd.append(`address.${addressKey}`, String(value[addressKey]));
        }
      });
      return;
    }

    // Special handling for amenities array (expects individual pk values)
    if (key === "amenities" && Array.isArray(value)) {
      value.forEach((amenityId) => {
        fd.append("amenities", String(amenityId));
      });
      return;
    }

    // Handle extra_costs array as JSON (assuming Django expects this as JSON)
    if (key === "extra_costs" && Array.isArray(value)) {
      fd.append(key, JSON.stringify(value));
      return;
    }

    // Handle other arrays as JSON strings
    if (Array.isArray(value)) {
      fd.append(key, JSON.stringify(value));
      return;
    }

    // Handle other objects as JSON strings
    if (typeof value === "object" && value !== null) {
      fd.append(key, JSON.stringify(value));
      return;
    }

    // Handle primitives
    fd.append(key, String(value));
  });

  return fd;
}

// Alternative version that serializes complex structures as JSON
export function convertToFormDataWithJSON(obj: Record<string, any>): FormData {
  const fd = new FormData();

  Object.keys(obj).forEach((key) => {
    const value = obj[key];

    if (value === null || value === undefined) {
      return;
    }

    // Handle File objects
    if (value instanceof File) {
      fd.append(key, value);
      return;
    }

    // Handle File arrays
    if (Array.isArray(value) && value.length > 0 && value[0] instanceof File) {
      value.forEach((file) => {
        fd.append(key, file);
      });
      return;
    }

    // Handle all other arrays and objects as JSON strings
    if (Array.isArray(value) || (typeof value === "object" && value !== null)) {
      fd.append(key, JSON.stringify(value));
      return;
    }

    // Handle primitives
    fd.append(key, String(value));
  });

  return fd;
}

// Flattened version that matches backend expectations
export function convertToFormDataFlattened(obj: Record<string, any>): FormData {
  const fd = new FormData();

  Object.keys(obj).forEach((key) => {
    const value = obj[key];

    if (value === null || value === undefined) {
      return;
    }

    // Handle File objects
    if (value instanceof File) {
      fd.append(key, value);
      return;
    }

    // Handle File arrays
    if (Array.isArray(value) && value.length > 0 && value[0] instanceof File) {
      value.forEach((file) => {
        fd.append(key, file);
      });
      return;
    }

    // Handle primitive arrays (like amenities: number[])
    if (
      Array.isArray(value) &&
      value.every((item) => typeof item !== "object")
    ) {
      value.forEach((item, index) => {
        fd.append(`${key}[${index}]`, String(item));
      });
      return;
    }

    // Handle arrays of objects (like extra_costs)
    if (
      Array.isArray(value) &&
      value.some((item) => typeof item === "object")
    ) {
      value.forEach((item, index) => {
        if (typeof item === "object" && item !== null) {
          Object.keys(item).forEach((subKey) => {
            fd.append(`${key}[${index}][${subKey}]`, String(item[subKey]));
          });
        }
      });
      return;
    }

    // Handle nested objects (like address) - flatten with dot notation
    if (typeof value === "object" && value !== null) {
      Object.keys(value).forEach((subKey) => {
        fd.append(`${key}.${subKey}`, String(value[subKey]));
      });
      return;
    }

    // Handle primitives
    fd.append(key, String(value));
  });

  return fd;
}

export function convertToFormDataDjangoStyle(
  obj: Record<string, any>,
): FormData {
  const fd = new FormData();

  Object.keys(obj).forEach((key) => {
    const value = obj[key];

    if (value === null || value === undefined) {
      return;
    }

    // Handle File objects
    if (value instanceof File) {
      fd.append(key, value);
      return;
    }

    // Handle File arrays
    if (Array.isArray(value) && value.length > 0 && value[0] instanceof File) {
      value.forEach((file) => {
        fd.append(key, file);
      });
      return;
    }

    // Handle primitive arrays
    if (
      Array.isArray(value) &&
      value.every((item) => typeof item !== "object")
    ) {
      value.forEach((item, index) => {
        fd.append(`${key}[${index}]`, String(item));
      });
      return;
    }

    // Handle arrays of objects - alternative format
    if (
      Array.isArray(value) &&
      value.some((item) => typeof item === "object")
    ) {
      value.forEach((item, index) => {
        if (typeof item === "object" && item !== null) {
          Object.keys(item).forEach((subKey) => {
            // Try different formats
            fd.append(`${key}[${index}][${subKey}]`, String(item[subKey]));
          });
        }
      });
      return;
    }

    // Handle nested objects - flatten completely
    if (typeof value === "object" && value !== null) {
      Object.keys(value).forEach((subKey) => {
        fd.append(`${key}[${subKey}]`, String(value[subKey]));
      });
      return;
    }

    // Handle primitives
    fd.append(key, String(value));
  });

  return fd;
}

export function debugFormData(formData: FormData): void {
  console.log("=== FormData Debug ===");
  for (let [key, value] of formData.entries()) {
    if (value instanceof File) {
      console.log(`${key}: [File] ${value.name} (${value.size} bytes)`);
    } else {
      console.log(`${key}: ${value}`);
    }
  }
  console.log("=== End FormData Debug ===");
}

export function formatMoney(num: number | undefined) {
  if (!num || Number.isNaN(num)) {
    return "₦--";
  }
  return `₦${num.toLocaleString("en")}`;
}

export const getTotalExtraCosts = (extraCosts) => {
  return extraCosts.reduce((total, cost) => {
    return total + parseFloat(cost.amount);
  }, 0);
};

export const to12Hour = (timeZ) =>
  new Date(`1970-01-01T${timeZ}`).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });

export function removeFalsyKeys<T extends Record<string, any>>(
  obj: T,
): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => Boolean(value)),
  ) as Partial<T>;
}
