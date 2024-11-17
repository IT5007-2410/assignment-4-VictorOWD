/*
  Additional dependencies are added to AwesomeProject
  See README.md in root directory
*/
import { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
  Cols,
  Cell,
} from "react-native-table-component";

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  Button,
  useColorScheme,
  View,
  Keyboard,
} from "react-native";

import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker from "@react-native-community/datetimepicker";

/**
 * Q5 - Styling
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    flexDirection: "column",
    backgroundColor: "#fff",
  },
  screenHeading: { fontSize: 32, fontWeight: "bold", textAlign: "center" },
  header: { height: 50, backgroundColor: "#537791" },
  text: { textAlign: "center" },
  dataWrapper: { marginTop: -1 },
  row: { height: 40, backgroundColor: "#E7E6E1" },
  textInput: { borderWidth: 1, borderColor: "grey", borderRadius: 8 },
  submitButton: { marginTop: 16 },
  submitMessage: { textAlign: "center" },
});
const width = [40, 80, 80, 80, 80, 80, 200];

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
      <View>
        <Text>Title</Text>
        <TextInput
          style={styles.textInput}
          keyboardType="default"
          value={newIssue.title}
          onChangeText={(text) => inputChange("title", text)}
        />
        <Text>Status</Text>
        <DropDownPicker
          open={dropdownOpen}
          value={dropdownValue}
          items={dropdownItems}
          setOpen={setDropdownOpen}
          setValue={setDropdownValue}
          setItems={setDropdownItems}
        />
        <Text>Owner</Text>
        <TextInput
          style={styles.textInput}
          keyboardType="default"
          value={newIssue.owner}
          onChangeText={(text) => inputChange("owner", text)}
        />
        <Text>Effort</Text>
        <TextInput
          style={styles.textInput}
          keyboardType="number-pad"
          value={newIssue.effort}
          onChangeText={(text) => inputChange("effort", text)}
        />
        <Text>Due: {newIssue.due.toDateString()}</Text>
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
      <Text style={styles.screenHeading}>Blacklist</Text>
      <Text>Owner to Blacklist</Text>
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
  );
}

/**
 * Components
 */
// Q1 - Dummy Issue Filter (rewritten as function component)
function IssueFilter() {
  return (
    <View>
      <Text>Dummy Issue Filter</Text>
    </View>
  );
}

// Q2 - Table of Issues
function IssueTable({ issues }) {
  // Renders template if no issues exist
  const issueRows = issues ? (
    issues.map((issue) => <IssueRow key={issue.id} issue={issue} />)
  ) : (
    <Row>
      <Cell data="No issues yet" colSpan={tableHeaders.length}></Cell>
    </Row>
  );

  const tableHeaders = [
    "ID",
    "Title",
    "Status",
    "Owner",
    "Created",
    "Effort",
    "Due",
  ];

  return (
    <View style={styles.container}>
      <Table>
        <Row data={tableHeaders} />
        {issueRows}
      </Table>
    </View>
  );
}

// Q2 - Each row
function IssueRow({ issue }) {
  // null & Date object handling
  const rowData = Object.values(issue).map((value) => {
    if (!value) return "N/A";
    if (value instanceof Date) {
      return value.toDateString();
    }
    return String(value);
  });

  return <Row data={rowData} />;
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
