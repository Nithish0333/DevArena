# Python Practice - Full Features!
print("Hello World!")

# Variables and Data Types
name = "John"
age = 25
print(f"Name: {name}, Age: {age}")

# If-Else Statements
if age >= 18:
    print("You are an adult")
else:
    print("You are a minor")

# Lists and Loops
numbers = [1, 2, 3, 4, 5]
print("List:", numbers)

for i in range(len(numbers)):
    print(f"Number {i}: {numbers[i]}")

# For-Each Loop
for num in numbers:
    print(f"Double: {num * 2}")

# Functions
def greet(person):
    return f"Hello, {person}!"

print(greet("Alice"))

# Classes and Objects
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def introduce(self):
        return f"Hi, I'm {self.name} and I'm {self.age} years old."

person1 = Person("Bob", 30)
print(person1.introduce())

# While Loop
count = 0
while count < 3:
    print(f"Count: {count}")
    count += 1