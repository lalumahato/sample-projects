console.log("Add new feature here...");

// add group feature
console.group();
console.log('Google');
console.log('Facebook');
console.log('Microsoft');
console.groupEnd();

// add table feature
let users = [
    {
        id: 101,
        name: 'Jessica'
    },
    {
        id: 102,
        name: 'Smith'
    },
    {
        id: 103,
        name: 'Peter'
    }
];
console.table(users);

/** Added test case */