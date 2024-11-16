import React, { useState, useEffect } from "react";
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
} from "react-native";

/*
  Styling
*/
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: "#fff" },
  header: { height: 50, backgroundColor: "#537791" },
  text: { textAlign: "center" },
  dataWrapper: { marginTop: -1 },
  row: { height: 40, backgroundColor: "#E7E6E1" },
});
const width = [40, 80, 80, 80, 80, 80, 200];

/*
  Components
*/
// Main component (rewritten as function component)
export default function IssueList() {
  const [issues, setIssues] = useState([]);

  // When component renders
  useEffect(() => {
    loadData();
  }, []);

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

  async function createIssue(issue) {
    const query = `mutation issueAdd($issue: IssueInputs!) {
        issueAdd(issue: $issue) {
        id
        }
    }`;

    const data = await graphQLFetch(query, { issue });
    if (data) {
      await loadData();
    }
  }

  return (
    <ScrollView>
      <IssueFilter />
      <IssueTable issues={issues} />

      {/****** Q3: Start Coding here. ******/}
      {/****** Q3: Code Ends here. ******/}

      {/****** Q4: Start Coding here. ******/}
      {/****** Q4: Code Ends here. ******/}
    </ScrollView>
  );
}

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
  const issueRows = issues.map((issue) => (
    <IssueRow key={issue.id} issue={issue} />
  ));

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
    return value;
  });

  return <Row data={rowData} />;
}

class IssueAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    /****** Q3: Start Coding here. Create State to hold inputs******/
    /****** Q3: Code Ends here. ******/
  }

  /****** Q3: Start Coding here. Add functions to hold/set state input based on changes in TextInput******/
  /****** Q3: Code Ends here. ******/

  handleSubmit() {
    /****** Q3: Start Coding here. Create an issue from state variables and call createIssue. Also, clear input field in front-end******/
    /****** Q3: Code Ends here. ******/
  }

  render() {
    return (
      <View>
        {/****** Q3: Start Coding here. Create TextInput field, populate state variables. Create a submit button, and on submit, trigger handleSubmit.*******/}
        {/****** Q3: Code Ends here. ******/}
      </View>
    );
  }
}

class BlackList extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    /****** Q4: Start Coding here. Create State to hold inputs******/
    /****** Q4: Code Ends here. ******/
  }
  /****** Q4: Start Coding here. Add functions to hold/set state input based on changes in TextInput******/
  /****** Q4: Code Ends here. ******/

  async handleSubmit() {
    /****** Q4: Start Coding here. Create an issue from state variables and issue a query. Also, clear input field in front-end******/
    /****** Q4: Code Ends here. ******/
  }

  render() {
    return (
      <View>
        {/****** Q4: Start Coding here. Create TextInput field, populate state variables. Create a submit button, and on submit, trigger handleSubmit.*******/}
        {/****** Q4: Code Ends here. ******/}
      </View>
    );
  }
}

/*
  Helpers
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
