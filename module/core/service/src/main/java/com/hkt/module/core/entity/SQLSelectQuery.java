package com.hkt.module.core.entity;

import java.util.ArrayList;
import java.util.List;

public class SQLSelectQuery {
	private List<Field>		fields	= new ArrayList<Field>();
	private List<String>	tables	= new ArrayList<String>();
	private List<Join>		joins		= new ArrayList<Join>();
	private List<String>	groupBy	= new ArrayList<String>();
	private List<String>	orderBy	= new ArrayList<String>();

	public SQLSelectQuery field(String exp) {
		fields.add(new Field(exp));
		return this;
	}

	public SQLSelectQuery field(String exp, String alias) {
		fields.add(new Field(exp, alias));
		return this;
	}

	public List<Field> getFields() {
		return fields;
	}

	public void setFields(List<Field> fields) {
		this.fields = fields;
	}

	public SQLSelectQuery table(String... table) {
		for (String sel : table)
			tables.add(sel);
		return this;
	}

	public List<String> getTables() {
		return tables;
	}

	public void setTables(List<String> tables) {
		this.tables = tables;
	}

	public SQLSelectQuery cond(String exp) {
		joins.add(new Join(exp, true));
		return this;
	}

	public List<Join> getJoins() {
		return joins;
	}

	public void setJoins(List<Join> joins) {
		this.joins = joins;
	}

	public SQLSelectQuery groupBy(String... field) {
		for (String sel : field)
			groupBy.add(sel);
		return this;
	}

	public List<String> getGroupBy() {
		return groupBy;
	}

	public void setGroupBy(List<String> groupBy) {
		this.groupBy = groupBy;
	}

	public SQLSelectQuery orderBy(String... field) {
		for (String sel : field)
			orderBy.add(sel);
		return this;
	}

	public List<String> getOrderBy() {
		return orderBy;
	}

	public void setOrderBy(List<String> orderBy) {
		this.orderBy = orderBy;
	}

	public String createSQLQuery() {
		StringBuilder b = new StringBuilder();
		b.append("SELECT").append("\n");
		for (int i = 0; i < fields.size(); i++) {
			Field f = fields.get(i);
			if (i < fields.size() - 1) {
				b.append("  ").append(f.getExpression()).append(",\n");
			} else {
				b.append("  ").append(f.getExpression()).append("\n");
			}
		}
		b.append("FROM").append("\n");
		b.append("  ");
		for (int i = 0; i < tables.size(); i++) {
			if (i > 0)
				b.append(", ");
			b.append(tables.get(i));
		}
		b.append("\n");

		if (joins.size() > 0) {
			b.append("WHERE").append("\n");
			for (int i = 0; i < joins.size(); i++) {
				Join join = joins.get(i);
				b.append("  ").append(join.getExpression());
				if (i < joins.size() - 1)
					b.append(" AND ").append("\n");
				else
					b.append("\n");
			}
		}
		if (groupBy.size() > 0) {
			b.append("GROUP BY");
			for (int i = 0; i < groupBy.size(); i++) {
				if (i > 0)
					b.append(",");
				b.append(" ").append(groupBy.get(i)).append(" ");
			}
			b.append("\n");
		}
		if (orderBy.size() > 0) {
			b.append("ORDER BY");
			for (int i = 0; i < orderBy.size(); i++) {
				if (i > 0)
					b.append(",");
				b.append(" ").append(orderBy.get(i)).append(" ");
			}
		}
		return b.toString();
	}

	static public class Field {
		private String	type;
		private String	expression;
		private String	alias;

		public Field() {
		}

		public Field(String exp) {
			this.expression = exp;
		}

		public Field(String exp, String alias) {
			this.expression = exp;
			this.alias = alias;
		}

		public String getType() {
			return this.type;
		}

		public void setType(String type) {
			this.type = type;
		}

		public String getExpression() {
			return expression;
		}

		public void setExpression(String expression) {
			this.expression = expression;
		}

		public String getAlias() {
			return alias == null ? expression : alias;
		}

		public void setAlias(String alias) {
			this.alias = alias;
		}
	}

	static public class Join {
		private String	expression;
		private boolean	mandatory;

		public Join() {
		}

		public Join(String exp) {
			this.expression = exp;
		}

		public Join(String exp, boolean m) {
			this.expression = exp;
			this.mandatory = m;
		}

		public String getExpression() {
			return expression;
		}

		public void setExpression(String expression) {
			this.expression = expression;
		}

		public boolean isMandatory() {
			return mandatory;
		}

		public void setMandatory(boolean mandatory) {
			this.mandatory = mandatory;
		}
	}
}
