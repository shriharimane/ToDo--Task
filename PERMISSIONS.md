# 🔐 Role-Based Permissions Guide

This document explains the exact permissions and behaviors of the Task Management System.

## Task Types

### 1. Personal Tasks
**Definition**: Tasks created by a user without assigning to anyone else.

**Creator Permissions**:
- ✅ Create task
- ✅ Edit title
- ✅ Edit description
- ✅ Edit due date
- ✅ Update status (Todo → In Progress → Done)
- ✅ Delete task
- ✅ View task

**Other Users**:
- ❌ View
- ❌ Edit
- ❌ Delete
- ❌ Update status

**Behavior**:
```
Personal Task
├── Only creator can see it
├── Only creator can modify it
└── Only creator can delete it
```

---

### 2. Assigned Tasks
**Definition**: Tasks assigned by one user (Assigner) to another user (Assignee).

## Permissions by Role

### Role 1: Task Assigner (Creator of the Task)

**Can Do**:
- ✅ Create assigned task
- ✅ Edit title
- ✅ Edit description
- ✅ Edit due date
- ✅ Change assignee (reassign to another user)
- ✅ View task and assignee's progress
- ✅ Delete task
- ✅ Add/remove assignee

**Cannot Do**:
- ❌ Update task status (Todo/In Progress/Done)
- ❌ Mark as complete

**Example Scenario**:
```
Manager (Assigner) assigns task to Developer (Assignee)
↓
Manager can:
  - Update title/description
  - Change due date
  - Reassign to another developer
  - See current status (set by developer)
  - Delete entire task
↓
Manager CANNOT:
  - Change task status directly
  - Mark task as "Done" (dev must do it)
```

### Role 2: Task Assignee (Assigned User)

**Can Do**:
- ✅ Update status (Todo → In Progress → Done)
- ✅ View task details
- ✅ See who created the task

**Cannot Do**:
- ❌ Edit title
- ❌ Edit description
- ❌ Edit due date
- ❌ Change assignee
- ❌ Delete task
- ❌ Reassign task

**Example Scenario**:
```
Developer (Assignee) receives task from Manager
↓
Developer can:
  - Change status based on progress
  - Add status updates (via status field)
  - View task requirements
↓
Developer CANNOT:
  - Modify task details
  - Delete task
  - Assign to someone else
```

### Role 3: Other Users (Not Creator or Assignee)

**Can Do**:
- ✅ View list of all users (for assignment)

**Cannot Do**:
- ❌ View assigned task details
- ❌ Edit assigned task
- ❌ Update status
- ❌ Delete task
- ❌ Access any private information

---

## Task Status Workflow

### Personal Tasks
```
Creator updates status anytime:
Todo → In Progress → Done (can go back anytime)
```

### Assigned Tasks
```
Assignee Updates Status ONLY:
Todo → In Progress → Done

Creator/Assigner:
- Sets initial title, description, due date
- Cannot change status
- Can monitor progress through status
- Can reassign if needed
```

---

## Data Visibility Matrix

| User Type | Personal Task | Assigned Task (Creator) | Assigned Task (Assignee) | Assigned Task (Other) |
|-----------|---------------|------------------------|--------------------------|-----------------------|
| **View** | ✅ Creator | ✅ Creator | ✅ Assignee | ❌ |
| **Edit Title** | ✅ Creator | ✅ Creator | ❌ Assignee | ❌ |
| **Edit Description** | ✅ Creator | ✅ Creator | ❌ Assignee | ❌ |
| **Edit Due Date** | ✅ Creator | ✅ Creator | ❌ Assignee | ❌ |
| **Update Status** | ✅ Creator | ❌ Creator | ✅ Assignee | ❌ |
| **Change Assignee** | N/A | ✅ Creator | ❌ Assignee | ❌ |
| **Delete** | ✅ Creator | ✅ Creator | ❌ Assignee | ❌ |

---

## API Permission Enforcement

### Create Task
```
Endpoint: POST /api/tasks
Required: Authentication (JWT Token)
Action: assigner_id = current_user_id
```

### Update Task
```
Endpoint: PATCH /api/tasks/:id

Assigned Task Logic:
1. Check if user is creator OR assignee
2. If creator AND assigned:
   - Allow: title, description, dueDate, assignedTo
   - Block: status updates
3. If assignee AND NOT creator:
   - Allow: status ONLY
   - Block: all other fields
4. If not creator or assignee:
   - Block: all operations (403 Forbidden)
```

### Delete Task
```
Endpoint: DELETE /api/tasks/:id
Requirement: Must be task creator
Others: Receive 403 Forbidden error
```

### Get Tasks
```
Endpoint: GET /api/tasks
Returns: Only tasks where user is:
  - Creator of personal tasks
  - Creator or assignee of assigned tasks
Filters: Status filtering applied to retrieved tasks
```

---

## Common Use Cases

### Case 1: Manager Creates Task for Developer
```
✓ Manager creates task with title, description, due date
✓ Manager assigns to Developer
✓ Developer receives task
✓ Developer updates status as they work (Todo → In Progress → Done)
✓ Manager can view progress but cannot change status
✓ Manager can reassign to different developer if needed
✓ Manager can update deadline
✗ Developer cannot modify title or description
```

### Case 2: User Creates Personal Task
```
✓ User creates personal task (no assignee)
✓ User has full control
✓ User updates status, title, description anytime
✓ User deletes task anytime
✗ Other users cannot see this task
```

### Case 3: Multiple Reassignment
```
✓ Manager assigns task to Dev1
✓ Manager reassigns same task to Dev2
✓ Dev1 loses access to task
✓ Dev2 gains access to task
✓ Dev2 can now update status
```

### Case 4: Unauthorized Access Attempt
```
✗ User A tries to access User B's personal task → 403 Forbidden
✗ User A tries to edit assigned task (not creator/assignee) → 403 Forbidden
✗ User A tries to delete assigned task (not creator) → 403 Forbidden
✓ User A can view list of all users
✓ User A can see their own tasks
```

---

## Error Messages for Permission Violations

| Scenario | Error Code | Message |
|----------|-----------|---------|
| No token provided | 401 | "No token provided. Please login" |
| Task not found | 404 | "Task not found" |
| Unauthorized access | 403 | "You do not have access to this task" |
| Assignee updating title | 403 | "Assignee can only update task status" |
| Creator updating status | 403 | "Task creator cannot update task status" |
| Non-creator deletion | 403 | "Only task creator can delete the task" |
| Invalid assignee | 404 | "Assigned user does not exist" |

---

## Frontend Implementation

### Task Card Display
```javascript
// Personal Task - Show all edit/delete buttons
if (task.taskType === 'Personal' && isCreator) {
  ✓ Show Edit button
  ✓ Show Delete button
}

// Assigned Task - Creator (Assigner)
if (task.taskType === 'Assigned' && isCreator && !isAssignee) {
  ✓ Show Edit button (title, description, due date)
  ✓ Show Delete button
  ✓ Cannot see "Update Status" button
}

// Assigned Task - Assignee
if (task.taskType === 'Assigned' && isAssignee && !isCreator) {
  ✓ Show "Update Status" button
  ✗ Cannot see Edit or Delete buttons
}

// Other Users
if (notCreatorAndNotAssignee) {
  ✗ No buttons visible
  ✗ Cannot edit/delete/update status
}
```

---

## Security Notes

1. **Server-Side Enforcement**: All permissions are validated on the backend
2. **Frontend is UX Only**: Frontend buttons are just UI hints
3. **API Checks**: Every request is checked for authorization
4. **No Token Leaks**: Errors don't reveal sensitive info
5. **JWT Expiration**: Tokens expire after 7 days

---

## Testing Permissions

### Test Case 1: Assignee Cannot Update Status
```bash
# Get task ID first
GET /api/tasks

# Try to update title as assignee (should fail)
PATCH /api/tasks/{id}
{ "title": "New title" }
→ Response: 403 "Assignee can only update task status"
```

### Test Case 2: Creator Cannot Update Status
```bash
# Create assigned task and GET its ID

# Try to update status as creator (should fail)
PATCH /api/tasks/{id}
{ "status": "Done" }
→ Response: 403 "Task creator cannot update task status"
```

### Test Case 3: Assignee Can Update Status
```bash
# Login as assignee

# Update status (should succeed)
PATCH /api/tasks/{id}
{ "status": "In Progress" }
→ Response: 200 OK with updated task
```

---

**Remember**: The permission system is enforced on both frontend (UX) and backend (Security). Always test API directly to verify server-side enforcement!
