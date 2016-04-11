package com.hkt.module.account;

import java.math.BigDecimal;



/**
 * 
 * @author longnt
 */
public class MyDouble extends Number implements Comparable<MyDouble> {
	
	public static final double	POSITIVE_INFINITY	= 1.0 / 0.0;
	
	public static final double	NEGATIVE_INFINITY	= -1.0 / 0.0;
	
	public static final double	NaN								= 0.0d / 0.0;
	
	public static final double	MAX_VALUE					= 0x1.fffffffffffffP+1023;	// 1.7976931348623157e+308
																																						
	public static final double	MIN_NORMAL				= 0x1.0p-1022;							// 2.2250738585072014E-308
																																						
	public static final double	MIN_VALUE					= 0x0.0000000000001P-1022;	// 4.9e-324
																																						
	public static final int			MAX_EXPONENT			= 1023;
	
	public static final int			MIN_EXPONENT			= -1022;
	
	public static final int			SIZE							= 64;
	private int									numDot						= -1;
	
	public void setNumDot(int numDot) {
		if (numDot > 0) {
			this.numDot = numDot;
		} else {
			this.numDot = 0;
		}
	}
	
	public String toString(double d) {
		BigDecimal bigDecimal;
		try {
			bigDecimal = new BigDecimal(d);
		} catch (Exception e) {
			bigDecimal = BigDecimal.ZERO;
		}
		
		int numberD = 2;
		if ((d > 1 && String.valueOf(d).contains(".00")) || String.valueOf(d).endsWith(".0") || String.valueOf(d).indexOf("E") > 0) {
			numberD = 0;
		}
		
		if (this.numDot >= 0) {
			numberD = this.numDot;
		}
		
		if (d < 1 && d > 0 && String.valueOf(d).contains(".00")) {
//			return String.valueOf(d);
			String s1 = String.valueOf(d);
			int indexDot = s1.indexOf("."); 
			numberD = 0;
			for (int i = indexDot; i < (s1.length()-1); i++) {
				numberD ++;
				if(s1.charAt(i) != '0')
					break;
			}
			return bigDecimal.setScale(numberD, BigDecimal.ROUND_HALF_DOWN).toPlainString();
		}
		String s = bigDecimal.setScale(numberD, BigDecimal.ROUND_HALF_DOWN).toPlainString();
		
		String number = "";
		int indexDot = s.indexOf('.');
		if (indexDot < 0) {
			for (int i = s.length() - 1; i >= 0; i--) {
				number += s.charAt(i);
				if (i > 0 && (s.length() - i) % 3 == 0) {
					number += ' ';
				}
			}
		} else {
			for (int i = s.length() - 1; i >= 0; i--) {
				number += s.charAt(i);
				if (i > 0 && i < indexDot && (indexDot - i) % 3 == 0) {
					number += ' ';
				}
			}
		}
		s = "";
		for (int i = number.length() - 1; i >= 0; i--) {
			s += number.charAt(i);
		}
		return s;
	}
	
	public static String toHexString(double d) {
		/*
		 * Modeled after the "a" conversion specifier in C99, section 7.19.6.1; however, the output of this method is more tightly specified.
		 */
		if (!FpUtils.isFinite(d))
			// For infinity and NaN, use the decimal output.
			return Double.toString(d);
		else {
			// Initialized to maximum size of output.
			StringBuffer answer = new StringBuffer(24);
			
			if (FpUtils.rawCopySign(1.0, d) == -1.0) // value is negative,
				answer.append("-"); // so append sign info
				
			answer.append("0x");
			
			d = Math.abs(d);
			
			if (d == 0.0) {
				answer.append("0.0p0");
			} else {
				boolean subnormal = (d < DoubleConsts.MIN_NORMAL);
				
				// Isolate significand bits and OR in a high-order bit
				// so that the string representation has a known
				// length.
				long signifBits = (Double.doubleToLongBits(d) & DoubleConsts.SIGNIF_BIT_MASK) | 0x1000000000000000L;
				
				// Subnormal values have a 0 implicit bit; normal
				// values have a 1 implicit bit.
				answer.append(subnormal ? "0." : "1.");
				
				// Isolate the low-order 13 digits of the hex
				// representation. If all the digits are zero,
				// replace with a single 0; otherwise, remove all
				// trailing zeros.
				String signif = Long.toHexString(signifBits).substring(3, 16);
				answer.append(signif.equals("0000000000000") ? // 13 zeros
				"0"
						: signif.replaceFirst("0{1,12}$", ""));
				
				// If the value is subnormal, use the E_min exponent
				// value for double; otherwise, extract and report d's
				// exponent (the representation of a subnormal uses
				// E_min -1).
				answer.append("p" + (subnormal ? DoubleConsts.MIN_EXPONENT : FpUtils.getExponent(d)));
			}
			return answer.toString();
		}
	}
	
	public static MyDouble valueOf(String s) throws NumberFormatException {
		return new MyDouble(FloatingDecimal.readJavaFormatString(deleteSpace(s)).doubleValue());
	}
	
	public static MyDouble valueOf(double d) {
		return new MyDouble(d);
	}
	
	public static double parseDouble(String s) throws NumberFormatException {
		return FloatingDecimal.readJavaFormatString(deleteSpace(s)).doubleValue();
	}
	
	static public boolean isNaN(double v) {
		return (v != v);
	}
	
	static public boolean isInfinite(double v) {
		return (v == POSITIVE_INFINITY) || (v == NEGATIVE_INFINITY);
	}
	
	private final double	value;
	
	public MyDouble(double value) {
		this.value = value;
	}
	
	public MyDouble(String s) throws NumberFormatException {
		// REMIND: this is inefficient
		this(valueOf(s).doubleValue());
	}
	
	public boolean isNaN() {
		return isNaN(value);
	}
	
	public boolean isInfinite() {
		return isInfinite(value);
	}
	
	public String toString() {
		return toString(value);
	}
	
	public byte byteValue() {
		return (byte) value;
	}
	
	public short shortValue() {
		return (short) value;
	}
	
	public int intValue() {
		return (int) value;
	}
	
	public long longValue() {
		return (long) value;
	}
	
	public float floatValue() {
		return (float) value;
	}
	
	public double doubleValue() {
		return (double) value;
	}
	
	public int hashCode() {
		long bits = doubleToLongBits(value);
		return (int) (bits ^ (bits >>> 32));
	}
	
	public boolean equals(Object obj) {
		return (obj instanceof MyDouble) && (doubleToLongBits(((MyDouble) obj).value) == doubleToLongBits(value));
	}
	
	public static long doubleToLongBits(double value) {
		long result = doubleToRawLongBits(value);
		// Check for NaN based on values of bit fields, maximum
		// exponent and nonzero significand.
		if (((result & DoubleConsts.EXP_BIT_MASK) == DoubleConsts.EXP_BIT_MASK) && (result & DoubleConsts.SIGNIF_BIT_MASK) != 0L)
			result = 0x7ff8000000000000L;
		return result;
	}
	
	public static native long doubleToRawLongBits(double value);
	
	public static native double longBitsToDouble(long bits);
	
	public int compareTo(MyDouble anotherDouble) {
		return MyDouble.compare(value, anotherDouble.value);
	}
	
	public static int compare(double d1, double d2) {
		if (d1 < d2)
			return -1; // Neither val is NaN, thisVal is smaller
		if (d1 > d2)
			return 1; // Neither val is NaN, thisVal is larger
			
		// Cannot use doubleToRawLongBits because of possibility of NaNs.
		long thisBits = Double.doubleToLongBits(d1);
		long anotherBits = Double.doubleToLongBits(d2);
		
		return (thisBits == anotherBits ? 0 : // Values are equal
				(thisBits < anotherBits ? -1 : // (-0.0, 0.0) or (!NaN, NaN)
						1)); // (0.0, -0.0) or (NaN, !NaN)
	}
	
	/** use serialVersionUID from JDK 1.0.2 for interoperability */
	private static final long	serialVersionUID	= -9172774392245257468L;
	
	private static String deleteSpace(String s) {
		if (s == null) {
			return "0";
		}
		String ss = s.replaceAll(" ", "");
		if (ss.isEmpty()) {
			return "0";
		}
		return ss;
	}
}
