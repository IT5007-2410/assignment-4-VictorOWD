/*
  Additional dependencies are added to AwesomeProject
  See README.md in root directory
*/
import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { DataTable } from "react-native-paper";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Button,
  View,
  Keyboard,
} from "react-native";

/**
 * Q5 - Styling
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    flexDirection: "column",
    color: "#F3F3E0",
    backgroundColor: "#CBDCEB",
  },
  screenHeading: { fontSize: 32, fontWeight: "bold", textAlign: "center" },
  dummyFilter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 40,
  },
  dummyFilterInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 4,
  },
  dummyFilterButton: {
    justifyContent: "center",
  },
  tableHeaderCell: { fontWeight: "bold" },
  form: {
    flexDirection: "column",
    gap: 8,
  },
  textLabel: { fontWeight: "bold" },
  textInput: {
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 4,
    height: 40,
  },
  dropdownPicker: {
    backgroundColor: "#CBDCEB",
    borderColor: "grey",
    borderRadius: 4,
    height: 40,
    zIndex: 10,
    marginBottom: 8,
  },
  submitButton: { marginTop: 16 },
  submitMessage: { textAlign: "center" },
});

/*
  Screens
*/
// Issues Screen (rewritten as function component)
// Q1 - Dummy filter component
// Q2 - Render issues
// Q5 - Rendered on a separate screen
export function IssuesScreen() {
  const [issues, setIssues] = useState([]);

  // Whenever this tab is navigated to
  useFocusEffect(() => {
    loadData();
  });

  async function loadData() {
    const query = `query {
        issueList {
        id title status owner
        created effort due
        }
    }`;

    const data = await graphQLFetch(query);
    if (data) {
      setIssues(data.issueList);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.screenHeading}>Issues</Text>
      <IssueFilter />
      <IssueTable issues={issues} />
    </ScrollView>
  );
}

// Add Issue Screen
// Q3 - Form to add issue
// Q5 - Rendered on a separate screen
export function AddIssueScreen() {
  const emptyInputs = {
    title: "",
    status: "New",
    owner: "",
    effort: "",
    due: new Date(), // GraphQLDate string
  };

  const [newIssue, setNewIssue] = useState(emptyInputs);
  const [submitMessage, setSubmitMessage] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownValue, setDropdownValue] = useState("New");
  const [dropdownItems, setDropdownItems] = useState([
    { label: "New", value: "New" },
    { label: "Assigned", value: "Assigned" },
    { label: "Fixed", value: "Fixed" },
    { label: "Closed", value: "Closed" },
  ]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    inputChange("status", dropdownValue);
  }, [dropdownValue]);

  function inputChange(field, value) {
    // Whenver user enters new input
    setSubmitMessage("");

    setNewIssue((prevNewIssue) => ({
      ...prevNewIssue,
      [field]: value,
    }));
  }

  // event is not used.
  function onDateChange(event, newDate) {
    setShowDatePicker(false);
    inputChange("due", newDate);
  }

  async function handleSubmit() {
    Keyboard.dismiss();

    const issue = {
      ...newIssue,
      effort: parseInt(newIssue.effort) || 0,
    };

    const query = `mutation issueAdd($issue: IssueInputs!) {
      issueAdd(issue: $issue) {
      id
      }
    }`;

    const data = await graphQLFetch(query, { issue });
    if (data) {
      setNewIssue(emptyInputs);
      setDropdownValue("New");
      setSubmitMessage(`Issue id: ${data.issueAdd.id} added.`);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.screenHeading}>Add Issue</Text>
      <View style={styles.form}>
        <Text style={styles.textLabel}>Title</Text>
        <TextInput
          style={styles.textInput}
          keyboardType="default"
          value={newIssue.title}
          onChangeText={(text) => inputChange("title", text)}
        />
        <Text style={styles.textLabel}>Status</Text>
        <DropDownPicker
          style={styles.dropdownPicker}
          open={dropdownOpen}
          value={dropdownValue}
          items={dropdownItems}
          setOpen={setDropdownOpen}
          setValue={setDropdownValue}
          setItems={setDropdownItems}
        />
        <Text style={styles.textLabel}>Owner</Text>
        <TextInput
          style={styles.textInput}
          keyboardType="default"
          value={newIssue.owner}
          onChangeText={(text) => inputChange("owner", text)}
        />
        <Text style={styles.textLabel}>Effort</Text>
        <TextInput
          style={styles.textInput}
          keyboardType="number-pad"
          value={newIssue.effort}
          onChangeText={(text) => inputChange("effort", text)}
        />
        <Text style={styles.textLabel}>Due: {newIssue.due.toDateString()}</Text>
        <Button
          color="#608BC1"
          title="Select a date"
          onPress={() => setShowDatePicker(true)}
        />
        {showDatePicker && (
          <DateTimePicker
            value={newIssue.due}
            display="default"
            mode="date"
            onChange={onDateChange}
          />
        )}
        <View style={styles.submitButton}>
          <Button color="#133E87" title="Add issue" onPress={handleSubmit} />
        </View>
        {submitMessage && (
          <Text style={styles.submitMessage}>{submitMessage}</Text>
        )}
      </View>
    </View>
  );
}

// Blacklist Screen (Rewritten as a function component)
// Q4 - Blacklist
// Q5 - Rendered on a separate screen
export function BlacklistScreen() {
  const [newBlacklistOwner, setNewBlacklistOwner] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");

  async function handleSubmit() {
    Keyboard.dismiss();

    const query = `mutation addToBlacklist($nameInput: String!) {
      addToBlacklist(nameInput: $nameInput)
    }`;

    const data = await graphQLFetch(query, { nameInput: newBlacklistOwner });

    if (data) {
      // Using local state as server code returns
      // the mutation with a null value
      setSubmitMessage(`${newBlacklistOwner} added to blacklist`);
      setNewBlacklistOwner("");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.screenHeading}>Blacklist</Text>
        <Text style={styles.textLabel}>Owner to Blacklist</Text>
        <TextInput
          style={styles.textInput}
          keyboardType="default"
          value={newBlacklistOwner}
          onChangeText={(text) => setNewBlacklistOwner(text)}
        />
        <View style={styles.submitButton}>
          <Button color="red" title="Blacklist" onPress={handleSubmit} />
        </View>
        {submitMessage && (
          <Text style={styles.submitMessage}>{submitMessage}</Text>
        )}
      </View>
    </View>
  );
}

/**
 * Components
 */
// Q1 - Dummy Issue Filter (rewritten as function component)
function IssueFilter() {
  return (
    <View style={styles.dummyFilter}>
      <TextInput
        style={styles.dummyFilterInput}
        placeholder="Filter by..."
        editable={false}
      />
      <View style={styles.dummyFilterButton}>
        <Button color="#608BC1" title="go" disabled={true} />
      </View>
    </View>
  );
}

// Q2 - Table of Issues
function IssueTable({ issues }) {
  // Renders template if no issues exist
  const issueRows = issues ? (
    issues.map((issue) => <IssueRow key={issue.id} issue={issue} />)
  ) : (
    <DataTable.Row>
      <DataTable.Cell>No issues yet.</DataTable.Cell>
    </DataTable.Row>
  );

  return (
    <DataTable>
      <DataTable.Header>
        <DataTable.Title textStyle={styles.tableHeaderCell}>ID</DataTable.Title>
        <DataTable.Title textStyle={styles.tableHeaderCell}>
          Title
        </DataTable.Title>
        <DataTable.Title textStyle={styles.tableHeaderCell}>
          Status
        </DataTable.Title>
        <DataTable.Title textStyle={styles.tableHeaderCell}>
          Owner
        </DataTable.Title>
        <DataTable.Title textStyle={styles.tableHeaderCell}>
          Created
        </DataTable.Title>
        <DataTable.Title textStyle={styles.tableHeaderCell}>
          Effort
        </DataTable.Title>
        <DataTable.Title textStyle={styles.tableHeaderCell}>
          Due
        </DataTable.Title>
      </DataTable.Header>
      {issueRows}
    </DataTable>
  );
}

// Q2 - Each row
function IssueRow({ issue }) {
  // null & Date object handling
  const cells = Object.entries(issue).map(([key, value]) => {
    if (!value) {
      return (
        <DataTable.Cell key={key}>
          <Text>N/A</Text>
        </DataTable.Cell>
      );
    }
    if (value instanceof Date) {
      return (
        <DataTable.Cell key={key}>
          <Text>{value.toDateString()}</Text>
        </DataTable.Cell>
      );
    }
    return (
      <DataTable.Cell key={key}>
        <Text>{String(value)}</Text>
      </DataTable.Cell>
    );
  });

  return <DataTable.Row>{cells}</DataTable.Row>;
}

/**
 * Helpers
 */

const dateRegex = new RegExp("^\\d\\d\\d\\d-\\d\\d-\\d\\d");

function jsonDateReviver(key, value) {
  if (dateRegex.test(value)) return new Date(value);
  return value;
}

async function graphQLFetch(query, variables = {}) {
  try {
    const response = await fetch("http://10.0.2.2:3000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });
    const body = await response.text();
    const result = JSON.parse(body, jsonDateReviver);

    if (result.errors) {
      const error = result.errors[0];
      if (error.extensions.code == "BAD_USER_INPUT") {
        const details = error.extensions.exception.errors.join("\n ");
        alert(`${error.message}:\n ${details}`);
      } else {
        alert(`${error.extensions.code}: ${error.message}`);
      }
    }
    return result.data;
  } catch (e) {
    alert(`Error in sending data to server: ${e.message}`);
  }
}
