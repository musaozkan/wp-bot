# WP_Bot v0.01a

### Overview
**WP_Bot v0.01a** is a lightweight WhatsApp messaging bot designed to streamline automated messaging tasks with additional features for tracking, logging, and error handling.  

---

## **Usage**
Run the bot using the following commands in the root directory of the project:

```bash
npm start
```

or  

```bash
node index.js
```

---

## **Features**
### ✅ **Core Functionalities**
1. **Automated Messaging:**  
   Sends messages seamlessly to your specified contacts.
2. **Contact Management:**  
   - Deletes used contacts automatically.  
   - Tracks unused contacts for future messaging.
3. **Message Screenshot:**  
   Captures and saves screenshots of successfully sent messages.
4. **Idle State:**  
   Maintains an idle state for better resource management.
5. **Scheduled Messaging:**  
   Configures message sending hours (e.g., between 9:00 AM and 5:00 PM).
6. **Error Handling:**  
   Includes global exceptions to automatically restart in case of errors.
7. **Comprehensive Logging:**  
   - Supports Turkish logs.  
   - Tracks the status of sent messages for accountability.

---

## **Planned Enhancements**
### 🛠 **Improvements**
1. **Dynamic Functionality:**  
   Enhance flexibility for more robust workflows and better customization.

2. **Database Integration:**  
   - Store data delicately, including:  
     - Message statuses  
     - Screenshot addresses  
     - Session details  
     - Message responses  

3. **User Interface (UI):**  
   a) **Dashboard Features:**  
      - Monitor activities  
      - Manage sessions  
      - Track logs visually  
      - Configure settings

---

## **Future Roadmap**
- Introduce multilingual log support.  
- Add analytics to track performance and user engagement.  
- Implement advanced scheduling options with timezone support.  
