const fs = require('fs');
const path = require('path');

function convertDirectoryToJson(rootDirectory) {
    let data = {};
    
    fs.readdirSync(rootDirectory).forEach(school => {
        if (school.startsWith('.')) return;
        const schoolPath = path.join(rootDirectory, school);
        if (!fs.lstatSync(schoolPath).isDirectory()) return;
        
        data[school] = {};
        
        fs.readdirSync(schoolPath).forEach(week => {
            if (week.startsWith('.')) return;
            const weekPath = path.join(schoolPath, week);
            if (!fs.lstatSync(weekPath).isDirectory()) return;
            
            const csvFiles = fs.readdirSync(weekPath).filter(file => file.endsWith('.csv') && !file.startsWith('.'));
            if (csvFiles.length === 0) return;
            
            csvFiles.forEach(csvFile => {
                const studentsFile = path.join(weekPath, csvFile);
                const students = fs.readFileSync(studentsFile, 'utf-8')
                    .split('\n')
                    .slice(1) // Skip header
                    .map(line => {
                        const [name, link] = line.split(',');
                        return { 
                            name: name ? name.trim() : "Unknown", 
                            link: link && link.trim() ? link.trim() : "No Source Link" 
                        };
                    })
                    .filter(student => student.name);
                
                data[school][week] = (data[school][week] || []).concat(students);
            });
        });
    });
    
    return data;
}

const rootDirectory = "school-makecode-links"; // Change this to your actual path
const outputFile = "output.json";

const result = convertDirectoryToJson(rootDirectory);
fs.writeFileSync(outputFile, JSON.stringify(result, null, 4), 'utf-8');
console.log(`JSON file saved as ${outputFile}`);
