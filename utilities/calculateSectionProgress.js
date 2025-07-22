export const calculateSectionProgress = (answers) => {
    let completedCount = 0;
    let totalCount = 0;
    // Loop over the keys in the answers object
    Object.keys(answers).forEach((subsectionName) => {
        // Loop over the answers in the subsection
        answers[subsectionName].forEach((answer) => {
            totalCount++;
            if (answer !== 0) {
                completedCount++;
            }
        });
    });
    return completedCount / totalCount;
}