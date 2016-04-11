package com.hkt.module.core.entity;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Path;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import com.hkt.util.BeanInspector;

public class FilterQuery {
	static public enum Operator {
		EQUAL, LT, GT, NOTNULL, NULL, LIKE, STRINGEQ, NOTEQUAL, EXISTS, IN
	}

	private int								maxReturn	= 1000000;
	private List<Expression>	fields		= new ArrayList<Expression>();

	public int getMaxReturn() {
		return maxReturn;
	}

	public void setMaxReturn(int maxReturn) {
		this.maxReturn = maxReturn;
	}

	public Expression getField(String name) {
		for (Expression e : fields) {
			if (e.getField().equals(name)) {
				return e;
			}
		}
		return null;
	}

	public List<Expression> getFields(String name) {
		List<Expression> list = new ArrayList<FilterQuery.Expression>();
		for (Expression e : fields) {
			if (e.getField().equals(name)) {
				list.add(e);
			}
		}
		return list;
	}

	public List<Expression> getFields() {
		return fields;
	}

	public void setFields(List<Expression> fields) {
		this.fields = fields;
	}

	public void add(String field, Operator op, Object exp) {
		fields.add(new Expression(field, op, exp));
	}

	public <T> CriteriaQuery<T> createCriteriaQuery(EntityManager em, Class<T> type) {
		
		CriteriaBuilder cb = em.getCriteriaBuilder();

		CriteriaQuery<T> criteriaQuery = cb.createQuery(type);
		Root<T> root = criteriaQuery.from(type);

		List<Predicate> filters = new ArrayList<Predicate>();
		for (Expression exp : fields) {
			Path<String> path = root.get(exp.getField());
			Operator op = exp.getOperator();
			if (op == Operator.LIKE) {
				String value = (String) exp.getValue();
				value = value.toLowerCase().replace('*', '%');
				filters.add(cb.like(cb.lower(path), value));
			} else if (op == Operator.LT) {
				filters.add(cb.lessThan(path, (Comparable) exp.getValue()));
			} else if (op == Operator.GT) {
				filters.add(cb.greaterThan(path, (Comparable) exp.getValue()));
			} else if (op == Operator.NOTEQUAL) {
				filters.add(cb.notEqual(path, exp.getValue()));
			} else {
				filters.add(cb.equal(path, exp.getValue()));
			}
		}
		Path<String> path = root.get("recycleBin");
		filters.add(cb.equal(path, 0));
		Predicate and = cb.and(filters.toArray(new Predicate[filters.size()]));
		criteriaQuery = criteriaQuery.select(root).where(and).orderBy(cb.desc(root.get("id")));
		return criteriaQuery;
	}

	public <T> String createNativeQuery(BeanInspector<T> typeInspector) {
		StringBuilder b = new StringBuilder();
		b.append("SELECT * FROM " + typeInspector.getType().getSimpleName());
		b.append(createQueryWhere(typeInspector));
		b.append(" ORDER BY startDate DESC");
		return b.toString();
	}

	public <T> String createQueryWhere(BeanInspector<T> typeInspector) {

		StringBuilder b = new StringBuilder();
		if (fields.size() > 0) {
			b.append(" WHERE ");
			boolean first = true;
			for (Expression exp : fields) {
				if (!first)
					b.append(" AND ");
				else
					b.append(" ");
				String field = exp.getField();
				Operator op = exp.getOperator();
				if (op == Operator.LIKE) {
					String value = (String) exp.getValue();
					value = value.replace('*', '%');
					b.append(field).append(" LIKE '").append(value).append("'");
				} else if (op == Operator.STRINGEQ) {
					b.append(field).append(" = '").append((Comparable) exp.getValue()).append("'");
				} else if (op == Operator.LT) {
					b.append(field).append(" < ").append((Comparable) exp.getValue());
				} else if (op == Operator.GT) {
					b.append(field).append(" > ").append((Comparable) exp.getValue());
				} else if (op == Operator.NOTEQUAL) {
					b.append(field).append(" <> '").append((Comparable) exp.getValue()).append("'");
				} else if (op == Operator.NOTNULL) {
					b.append(field).append(" IS NOT NULL");
				} else if (op == Operator.NULL) {
					b.append(field).append(" IS NULL");
				} else {
					b.append(field).append(" = ").append((Comparable) exp.getValue());
				}
				first = false;
			}
		}
		return b.toString();
	}

	static public class Expression {
		private Operator	operator;
		private Object		value;
		private String		field;

		public Expression() {
		}

		public Expression(String field, Operator op, Object exp) {
			this.field = field;
			this.operator = op;
			this.value = exp;
		}

		public Operator getOperator() {
			return operator;
		}

		public void setOperator(Operator operator) {
			this.operator = operator;
		}

		public String getField() {
			return field;
		}

		public void setField(String field) {
			this.field = field;
		}

		public Object getValue() {
			return value;
		}

		public void setValue(Object value) {
			this.value = value;
		}
	}
}
