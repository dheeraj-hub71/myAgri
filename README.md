# myAgri
SET 1 – FULL PRACTICAL EXAM WRITE-UP + EXECUTION
EXP 3: Generation and Verification of Time Delay Using Loop Instruction in 8086
Aim

To generate a time delay using loop instruction in 8086 microprocessor.

Algorithm
Load a large count value in CX register
Use NOP inside loop
Use LOOP instruction
Stop when CX = 0
Full Code (8086)
.MODEL SMALL
.STACK 100H
.CODE

START:
    MOV CX, 0FFFFH     ; large count for delay

DELAY:
    NOP                ; no operation
    LOOP DELAY         ; decrement CX and repeat

    MOV AH, 4CH
    INT 21H

END START
How to execute in exam
Open EMU8086 / MASM
Paste code
Compile
Run
Observe that execution takes a little time before termination → this is delay
Output

Time delay is generated successfully.

EXP 5: ALP to Check Whether Number is Even or Odd

This is very important for exam.

Aim

To write ALP to check whether the given number is even or odd.

Algorithm
Take number in AL
AND it with 01H
If result = 0 → Even
Else → Odd
Full Code
.MODEL SMALL
.STACK 100H
.DATA
    NUM DB 05H
    MSG1 DB 'EVEN NUMBER$'
    MSG2 DB 'ODD NUMBER$'

.CODE
START:
    MOV AX, @DATA
    MOV DS, AX

    MOV AL, NUM
    AND AL, 01H
    JZ EVEN

ODD:
    LEA DX, MSG2
    MOV AH, 09H
    INT 21H
    JMP STOP

EVEN:
    LEA DX, MSG1
    MOV AH, 09H
    INT 21H

STOP:
    MOV AH, 4CH
    INT 21H

END START
Output

For 05H → ODD NUMBER

For 04H → EVEN NUMBER

Viva logic

Last bit check:

0 → even
1 → odd
EXP 9: ALP Using Macro
Aim

To write ALP using macro.

Full Code
.MODEL SMALL
.STACK 100H
.DATA
    MSG DB 'HELLO$'

PRINT MACRO MESSAGE
    LEA DX, MESSAGE
    MOV AH, 09H
    INT 21H
ENDM

.CODE
START:
    MOV AX, @DATA
    MOV DS, AX

    PRINT MSG

    MOV AH, 4CH
    INT 21H

END START
Output
HELLO
Viva

Macro = reusable code block

EXP 10: Linux SysAdmin – Processes & Permissions

This one is practical terminal-based.

Commands for Process
Show running processes
ps
Detailed processes
ps -aux
Live process monitor
top
Kill process
kill 1234

(1234 = process ID)

File Permissions
Check permissions
ls -l

Example output:

-rwxr-xr--

Meaning:

Owner = rwx
Group = r-x
Others = r--
Change permission
chmod 777 file.txt
Common values
Code	Meaning
7	rwx
6	rw-
5	r-x
4	r--
Example execution in exam
touch file1.txt
ls -l
chmod 777 file1.txt
ls -l
EXP 15: Project Scheduling Using Gantt Chart

This is mostly drawing + theory.

Example Chart
Task	1	2	3	4	5
Planning	█	█			
Design		█	█		
Coding			█	█	█
Testing					█
How to write in exam

Draw tasks on Y-axis and days on X-axis.

EXP 13: Shell Scripting for Automation

Very important for execution.

Full Script – Addition
#!/bin/bash

echo "Enter first number"
read a

echo "Enter second number"
read b

sum=$((a+b))

echo "Sum = $sum"
