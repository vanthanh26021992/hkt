package com.hkt.module.core.search;

import java.util.Calendar;

import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.queryparser.classic.ParseException;
import org.apache.lucene.queryparser.classic.QueryParser;
import org.apache.lucene.search.NumericRangeQuery;
import org.apache.lucene.search.Query;
import org.apache.lucene.util.Version;

import com.hkt.util.text.DateUtil;
/**
 * Author : Tuan Nguyen
 */
public class DocumentQueryParser extends QueryParser {
  
  public DocumentQueryParser(Analyzer a) {
    this(a, "text");
  }
  
  public DocumentQueryParser(Analyzer a, String defaultField) {
    super(Version.LUCENE_46, defaultField, a);
  }
  
  protected Query getRangeQuery(String field, String part1, String part2, boolean startInclusive, boolean endInclusive) throws ParseException {
    if(field.endsWith(":date")) {
      try {
        long from = 0, to = 0 ;
        if(part1.indexOf('@') > 0) {
          from = com.hkt.util.text.DateUtil.parseCompactDateTime(part1).getTime();
        } else {
          from = DateUtil.parseCompactDate(part1).getTime() ;
          Calendar cal = Calendar.getInstance() ;
          cal.setTimeInMillis(from) ;
          cal.set(Calendar.HOUR_OF_DAY, 0) ;
          cal.set(Calendar.MINUTE, 0) ;
          cal.set(Calendar.SECOND, 0) ;
          from = cal.getTimeInMillis() ;
        }
        
        if(part2.indexOf('@') > 0) {
          to = DateUtil.parseCompactDateTime(part2).getTime() ;
        } else {
          to = DateUtil.parseCompactDate(part2).getTime() ;
          Calendar cal = Calendar.getInstance() ;
          cal.setTimeInMillis(to) ;
          cal.set(Calendar.HOUR_OF_DAY, 23) ;
          cal.set(Calendar.MINUTE, 59) ;
          cal.set(Calendar.SECOND, 59) ;
          to = cal.getTimeInMillis() ;
        }
        return NumericRangeQuery.newLongRange(field, from, to, startInclusive, endInclusive) ;
      } catch(Exception ex) {
        throw new ParseException("Cannot parse field = " + field + ", part1 = " + part1 + ", part2 = " + part2) ;
      }
    } else if(field.endsWith(":int")) {
    	return NumericRangeQuery.newIntRange(field, Integer.parseInt(part1), Integer.parseInt(part2), startInclusive, endInclusive) ;
    } else if(field.endsWith(":long")) {
    	return NumericRangeQuery.newLongRange(field, Long.parseLong(part1), Long.parseLong(part2), startInclusive, endInclusive) ;
    } else if(field.endsWith(":float")) {
    	return NumericRangeQuery.newFloatRange(field, Float.parseFloat(part1), Float.parseFloat(part2), startInclusive, endInclusive) ;
    } else if(field.endsWith(":dbl")) {
    	return NumericRangeQuery.newDoubleRange(field, Double.parseDouble(part1), Double.parseDouble(part2), startInclusive, endInclusive) ;
    }
    return super.getRangeQuery(field, part1, part2, startInclusive, endInclusive) ;
  }
}