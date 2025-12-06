// Global Storage Mock
// This file mocks localStorage and sessionStorage to prevent SecurityErrors
// in environments where storage access is restricted (e.g., headless browsers without storage paths).

const createStorageMock = () => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => {
            store[key] = value.toString();
        },
        removeItem: (key) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        },
        key: (index) => Object.keys(store)[index] || null,
        get length() {
            return Object.keys(store).length;
        }
    };
};

try {
    // Try to access localStorage to see if it throws
    window.localStorage.getItem('test');
} catch (e) {
    console.warn('Storage access restricted. Using in-memory mock.');

    // Define mocks using Object.defineProperty to bypass read-only restrictions if any
    Object.defineProperty(window, 'localStorage', {
        value: createStorageMock(),
        writable: true
    });

    Object.defineProperty(window, 'sessionStorage', {
        value: createStorageMock(),
        writable: true
    });
}
