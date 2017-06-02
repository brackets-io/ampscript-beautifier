define(function (require, exports, module) {

	var parse = function (text) {

		var parseResult = peg$parse(text)

			function peg$subclass(child, parent) {
			function ctor() {
				this.constructor = child;
			}
			ctor.prototype = parent.prototype;
			child.prototype = new ctor();
		}

		function peg$SyntaxError(message, expected, found, location) {
			this.message = message;
			this.expected = expected;
			this.found = found;
			this.location = location;
			this.name = "SyntaxError";

			if (typeof Error.captureStackTrace === "function") {
				Error.captureStackTrace(this, peg$SyntaxError);
			}
		}

		peg$subclass(peg$SyntaxError, Error);

		peg$SyntaxError.buildMessage = function (expected, found) {
			var DESCRIBE_EXPECTATION_FNS = {
				literal: function (expectation) {
					return "\"" + literalEscape(expectation.text) + "\"";
				},

				"class": function (expectation) {
					var escapedParts = "",
						i;

					for (i = 0; i < expectation.parts.length; i++) {
						escapedParts += expectation.parts[i] instanceof Array ? classEscape(expectation.parts[i][0]) + "-" + classEscape(expectation.parts[i][1]) : classEscape(expectation.parts[i]);
					}

					return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";
				},

				any: function (expectation) {
					return "any character";
				},

				end: function (expectation) {
					return "end of input";
				},

				other: function (expectation) {
					return expectation.description;
				}
			};

			function hex(ch) {
				return ch.charCodeAt(0).toString(16).toUpperCase();
			}

			function literalEscape(s) {
				return s
					.replace(/\\/g, '\\\\')
					.replace(/"/g, '\\"')
					.replace(/\0/g, '\\0')
					.replace(/\t/g, '\\t')
					.replace(/\n/g, '\\n')
					.replace(/\r/g, '\\r')
					.replace(/[\x00-\x0F]/g, function (ch) {
						return '\\x0' + hex(ch);
					})
					.replace(/[\x10-\x1F\x7F-\x9F]/g, function (ch) {
						return '\\x' + hex(ch);
					});
			}

			function classEscape(s) {
				return s
					.replace(/\\/g, '\\\\')
					.replace(/\]/g, '\\]')
					.replace(/\^/g, '\\^')
					.replace(/-/g, '\\-')
					.replace(/\0/g, '\\0')
					.replace(/\t/g, '\\t')
					.replace(/\n/g, '\\n')
					.replace(/\r/g, '\\r')
					.replace(/[\x00-\x0F]/g, function (ch) {
						return '\\x0' + hex(ch);
					})
					.replace(/[\x10-\x1F\x7F-\x9F]/g, function (ch) {
						return '\\x' + hex(ch);
					});
			}

			function describeExpectation(expectation) {
				return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
			}

			function describeExpected(expected) {
				var descriptions = new Array(expected.length),
					i, j;

				for (i = 0; i < expected.length; i++) {
					descriptions[i] = describeExpectation(expected[i]);
				}

				descriptions.sort();

				if (descriptions.length > 0) {
					for (i = 1, j = 1; i < descriptions.length; i++) {
						if (descriptions[i - 1] !== descriptions[i]) {
							descriptions[j] = descriptions[i];
							j++;
						}
					}
					descriptions.length = j;
				}

				switch (descriptions.length) {
					case 1:
						return descriptions[0];

					case 2:
						return descriptions[0] + " or " + descriptions[1];

					default:
						return descriptions.slice(0, -1).join(", ") + ", or " + descriptions[descriptions.length - 1];
				}
			}

			function describeFound(found) {
				return found ? "\"" + literalEscape(found) + "\"" : "end of input";
			}

			return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
		};

		function peg$parse(input, options) {
			options = options !== void 0 ? options : {};

			var peg$FAILED = {},

				peg$startRuleFunctions = {
					start: peg$parsestart
				},
				peg$startRuleFunction = peg$parsestart,

				peg$c0 = "%%[",
				peg$c1 = peg$literalExpectation("%%[", false),
				peg$c2 = function (startscript) {
					return '%%['
				},
				peg$c3 = "]%%",
				peg$c4 = peg$literalExpectation("]%%", false),
				peg$c5 = function (endscript) {
					return ']%%'
				},
				peg$c6 = /^[()]/,
				peg$c7 = peg$classExpectation(["(", ")"], false, false),
				peg$c8 = function (text) {
					return text
				},
				peg$c9 = /^[[\]]/,
				peg$c10 = peg$classExpectation(["[", "]"], false, false),
				peg$c11 = /^[%]/,
				peg$c12 = peg$classExpectation(["%"], false, false),
				peg$c13 = "%%=",
				peg$c14 = peg$literalExpectation("%%=", false),
				peg$c15 = "=%%",
				peg$c16 = peg$literalExpectation("=%%", false),
				peg$c17 = /^[\-A-Za-z0-9_@=,\/*!.<>:?;']/,
				peg$c18 = peg$classExpectation(["-", ["A", "Z"], ["a", "z"], ["0", "9"], "_", "@", "=", ",", "/", "*", "!", ".", "<", ">", ":", "?", ";", "'"], false, false),
				peg$c19 = function (text) {
					return text.join("")
				},
				peg$c20 = "\"",
				peg$c21 = peg$literalExpectation("\"", false),
				peg$c22 = function (text) {
					return '"'
				},
				peg$c23 = /^[\n]/,
				peg$c24 = peg$classExpectation(["\n"], false, false),
				peg$c25 = function (text) {
					return '@@LINEBREAK'
				},
				peg$c26 = /^[\t]/,
				peg$c27 = peg$classExpectation(["\t"], false, false),
				peg$c28 = function (text) {
					return '@@INDENT'
				},
				peg$c29 = "  ",
				peg$c30 = peg$literalExpectation("  ", false),
				peg$c31 = "   ",
				peg$c32 = peg$literalExpectation("   ", false),
				peg$c33 = "    ",
				peg$c34 = peg$literalExpectation("    ", false),
				peg$c35 = "     ",
				peg$c36 = peg$literalExpectation("     ", false),
				peg$c37 = "      ",
				peg$c38 = peg$literalExpectation("      ", false),
				peg$c39 = "       ",
				peg$c40 = peg$literalExpectation("       ", false),
				peg$c41 = "        ",
				peg$c42 = peg$literalExpectation("        ", false),
				peg$c43 = "         ",
				peg$c44 = peg$literalExpectation("         ", false),
				peg$c45 = "          ",
				peg$c46 = peg$literalExpectation("          ", false),
				peg$c47 = "           ",
				peg$c48 = peg$literalExpectation("           ", false),
				peg$c49 = "            ",
				peg$c50 = peg$literalExpectation("            ", false),
				peg$c51 = "             ",
				peg$c52 = peg$literalExpectation("             ", false),
				peg$c53 = "              ",
				peg$c54 = peg$literalExpectation("              ", false),
				peg$c55 = "               ",
				peg$c56 = peg$literalExpectation("               ", false),
				peg$c57 = "                ",
				peg$c58 = peg$literalExpectation("                ", false),
				peg$c59 = "                 ",
				peg$c60 = peg$literalExpectation("                 ", false),
				peg$c61 = "                  ",
				peg$c62 = peg$literalExpectation("                  ", false),
				peg$c63 = "                   ",
				peg$c64 = peg$literalExpectation("                   ", false),
				peg$c65 = "                    ",
				peg$c66 = peg$literalExpectation("                    ", false),
				peg$c67 = "                     ",
				peg$c68 = peg$literalExpectation("                     ", false),
				peg$c69 = "                      ",
				peg$c70 = peg$literalExpectation("                      ", false),
				peg$c71 = "                       ",
				peg$c72 = peg$literalExpectation("                       ", false),
				peg$c73 = "                        ",
				peg$c74 = peg$literalExpectation("                        ", false),
				peg$c75 = "                         ",
				peg$c76 = peg$literalExpectation("                         ", false),
				peg$c77 = "                          ",
				peg$c78 = peg$literalExpectation("                          ", false),
				peg$c79 = "                           ",
				peg$c80 = peg$literalExpectation("                           ", false),
				peg$c81 = "                            ",
				peg$c82 = peg$literalExpectation("                            ", false),
				peg$c83 = "                             ",
				peg$c84 = peg$literalExpectation("                             ", false),
				peg$c85 = peg$otherExpectation("whitespace"),
				peg$c86 = /^[ \r ]/,
				peg$c87 = peg$classExpectation([" ", "\r", " "], false, false),

				peg$currPos = 0,
				peg$savedPos = 0,
				peg$posDetailsCache = [{
					line: 1,
					column: 1
				}],
				peg$maxFailPos = 0,
				peg$maxFailExpected = [],
				peg$silentFails = 0,

				peg$result;

			if ("startRule" in options) {
				if (!(options.startRule in peg$startRuleFunctions)) {
					throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
				}

				peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
			}

			function text() {
				return input.substring(peg$savedPos, peg$currPos);
			}

			function location() {
				return peg$computeLocation(peg$savedPos, peg$currPos);
			}

			function expected(description, location) {
				location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)

				throw peg$buildStructuredError(
        [peg$otherExpectation(description)],
					input.substring(peg$savedPos, peg$currPos),
					location
				);
			}

			function error(message, location) {
				location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)

				throw peg$buildSimpleError(message, location);
			}

			function peg$literalExpectation(text, ignoreCase) {
				return {
					type: "literal",
					text: text,
					ignoreCase: ignoreCase
				};
			}

			function peg$classExpectation(parts, inverted, ignoreCase) {
				return {
					type: "class",
					parts: parts,
					inverted: inverted,
					ignoreCase: ignoreCase
				};
			}

			function peg$anyExpectation() {
				return {
					type: "any"
				};
			}

			function peg$endExpectation() {
				return {
					type: "end"
				};
			}

			function peg$otherExpectation(description) {
				return {
					type: "other",
					description: description
				};
			}

			function peg$computePosDetails(pos) {
				var details = peg$posDetailsCache[pos],
					p;

				if (details) {
					return details;
				} else {
					p = pos - 1;
					while (!peg$posDetailsCache[p]) {
						p--;
					}

					details = peg$posDetailsCache[p];
					details = {
						line: details.line,
						column: details.column
					};

					while (p < pos) {
						if (input.charCodeAt(p) === 10) {
							details.line++;
							details.column = 1;
						} else {
							details.column++;
						}

						p++;
					}

					peg$posDetailsCache[pos] = details;
					return details;
				}
			}

			function peg$computeLocation(startPos, endPos) {
				var startPosDetails = peg$computePosDetails(startPos),
					endPosDetails = peg$computePosDetails(endPos);

				return {
					start: {
						offset: startPos,
						line: startPosDetails.line,
						column: startPosDetails.column
					},
					end: {
						offset: endPos,
						line: endPosDetails.line,
						column: endPosDetails.column
					}
				};
			}

			function peg$fail(expected) {
				if (peg$currPos < peg$maxFailPos) {
					return;
				}

				if (peg$currPos > peg$maxFailPos) {
					peg$maxFailPos = peg$currPos;
					peg$maxFailExpected = [];
				}

				peg$maxFailExpected.push(expected);
			}

			function peg$buildSimpleError(message, location) {
				return new peg$SyntaxError(message, null, null, location);
			}

			function peg$buildStructuredError(expected, found, location) {
				return new peg$SyntaxError(
					peg$SyntaxError.buildMessage(expected, found),
					expected,
					found,
					location
				);
			}

			function peg$parsestart() {
				var s0, s1;

				s0 = [];
				s1 = peg$parseText();
				if (s1 !== peg$FAILED) {
					while (s1 !== peg$FAILED) {
						s0.push(s1);
						s1 = peg$parseText();
					}
				} else {
					s0 = peg$FAILED;
				}

				return s0;
			}

			function peg$parseText() {
				var s0;

				s0 = peg$parseAMPscriptStart();
				if (s0 === peg$FAILED) {
					s0 = peg$parseInlineAMPscriptStart();
					if (s0 === peg$FAILED) {
						s0 = peg$parseInlineAMPscriptEnd();
						if (s0 === peg$FAILED) {
							s0 = peg$parseLinebreak();
							if (s0 === peg$FAILED) {
								s0 = peg$parseSpaces30();
								if (s0 === peg$FAILED) {
									s0 = peg$parseSpaces29();
									if (s0 === peg$FAILED) {
										s0 = peg$parseSpaces28();
										if (s0 === peg$FAILED) {
											s0 = peg$parseSpaces27();
											if (s0 === peg$FAILED) {
												s0 = peg$parseSpaces26();
												if (s0 === peg$FAILED) {
													s0 = peg$parseSpaces25();
													if (s0 === peg$FAILED) {
														s0 = peg$parseSpaces24();
														if (s0 === peg$FAILED) {
															s0 = peg$parseSpaces23();
															if (s0 === peg$FAILED) {
																s0 = peg$parseSpaces22();
																if (s0 === peg$FAILED) {
																	s0 = peg$parseSpaces21();
																	if (s0 === peg$FAILED) {
																		s0 = peg$parseSpaces20();
																		if (s0 === peg$FAILED) {
																			s0 = peg$parseSpaces19();
																			if (s0 === peg$FAILED) {
																				s0 = peg$parseSpaces18();
																				if (s0 === peg$FAILED) {
																					s0 = peg$parseSpaces17();
																					if (s0 === peg$FAILED) {
																						s0 = peg$parseSpaces16();
																						if (s0 === peg$FAILED) {
																							s0 = peg$parseSpaces15();
																							if (s0 === peg$FAILED) {
																								s0 = peg$parseSpaces14();
																								if (s0 === peg$FAILED) {
																									s0 = peg$parseSpaces13();
																									if (s0 === peg$FAILED) {
																										s0 = peg$parseSpaces13();
																										if (s0 === peg$FAILED) {
																											s0 = peg$parseSpaces12();
																											if (s0 === peg$FAILED) {
																												s0 = peg$parseSpaces11();
																												if (s0 === peg$FAILED) {
																													s0 = peg$parseSpaces10();
																													if (s0 === peg$FAILED) {
																														s0 = peg$parseSpaces9();
																														if (s0 === peg$FAILED) {
																															s0 = peg$parseSpaces8();
																															if (s0 === peg$FAILED) {
																																s0 = peg$parseSpaces7();
																																if (s0 === peg$FAILED) {
																																	s0 = peg$parseSpaces6();
																																	if (s0 === peg$FAILED) {
																																		s0 = peg$parseSpaces5();
																																		if (s0 === peg$FAILED) {
																																			s0 = peg$parseSpaces4();
																																			if (s0 === peg$FAILED) {
																																				s0 = peg$parseSpaces3();
																																				if (s0 === peg$FAILED) {
																																					s0 = peg$parseSpaces2();
																																					if (s0 === peg$FAILED) {
																																						s0 = peg$parseIndent();
																																						if (s0 === peg$FAILED) {
																																							s0 = peg$parseFunction();
																																							if (s0 === peg$FAILED) {
																																								s0 = peg$parseQuotes();
																																								if (s0 === peg$FAILED) {
																																									s0 = peg$parseCode();
																																									if (s0 === peg$FAILED) {
																																										s0 = peg$parseAMPscriptEnd();
																																										if (s0 === peg$FAILED) {
																																											s0 = peg$parseSquareBrackets();
																																										}
																																									}
																																								}
																																							}
																																						}
																																					}
																																				}
																																			}
																																		}
																																	}
																																}
																															}
																														}
																													}
																												}
																											}
																										}
																									}
																								}
																							}
																						}
																					}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}

				return s0;
			}

			function peg$parseAMPscriptStart() {
				var s0, s1, s2, s3;

				s0 = peg$currPos;
				if (input.substr(peg$currPos, 3) === peg$c0) {
					s1 = peg$c0;
					peg$currPos += 3;
				} else {
					s1 = peg$FAILED;
					if (peg$silentFails === 0) {
						peg$fail(peg$c1);
					}
				}
				if (s1 !== peg$FAILED) {
					s2 = [];
					s3 = peg$parsews();
					while (s3 !== peg$FAILED) {
						s2.push(s3);
						s3 = peg$parsews();
					}
					if (s2 !== peg$FAILED) {
						peg$savedPos = s0;
						s1 = peg$c2(s1);
						s0 = s1;
					} else {
						peg$currPos = s0;
						s0 = peg$FAILED;
					}
				} else {
					peg$currPos = s0;
					s0 = peg$FAILED;
				}

				return s0;
			}

			function peg$parseAMPscriptEnd() {
				var s0, s1, s2;

				s0 = peg$currPos;
				s1 = [];
				s2 = peg$parsews();
				while (s2 !== peg$FAILED) {
					s1.push(s2);
					s2 = peg$parsews();
				}
				if (s1 !== peg$FAILED) {
					if (input.substr(peg$currPos, 3) === peg$c3) {
						s2 = peg$c3;
						peg$currPos += 3;
					} else {
						s2 = peg$FAILED;
						if (peg$silentFails === 0) {
							peg$fail(peg$c4);
						}
					}
					if (s2 !== peg$FAILED) {
						peg$savedPos = s0;
						s1 = peg$c5(s1);
						s0 = s1;
					} else {
						peg$currPos = s0;
						s0 = peg$FAILED;
					}
				} else {
					peg$currPos = s0;
					s0 = peg$FAILED;
				}

				return s0;
			}

			function peg$parseFunction() {
				var s0, s1, s2, s3;

				s0 = peg$currPos;
				if (peg$c6.test(input.charAt(peg$currPos))) {
					s1 = input.charAt(peg$currPos);
					peg$currPos++;
				} else {
					s1 = peg$FAILED;
					if (peg$silentFails === 0) {
						peg$fail(peg$c7);
					}
				}
				if (s1 !== peg$FAILED) {
					s2 = [];
					s3 = peg$parsews();
					while (s3 !== peg$FAILED) {
						s2.push(s3);
						s3 = peg$parsews();
					}
					if (s2 !== peg$FAILED) {
						peg$savedPos = s0;
						s1 = peg$c8(s1);
						s0 = s1;
					} else {
						peg$currPos = s0;
						s0 = peg$FAILED;
					}
				} else {
					peg$currPos = s0;
					s0 = peg$FAILED;
				}

				return s0;
			}

			function peg$parseSquareBrackets() {
				var s0, s1, s2, s3;

				s0 = peg$currPos;
				if (peg$c9.test(input.charAt(peg$currPos))) {
					s1 = input.charAt(peg$currPos);
					peg$currPos++;
				} else {
					s1 = peg$FAILED;
					if (peg$silentFails === 0) {
						peg$fail(peg$c10);
					}
				}
				if (s1 !== peg$FAILED) {
					s2 = [];
					s3 = peg$parsews();
					while (s3 !== peg$FAILED) {
						s2.push(s3);
						s3 = peg$parsews();
					}
					if (s2 !== peg$FAILED) {
						peg$savedPos = s0;
						s1 = peg$c8(s1);
						s0 = s1;
					} else {
						peg$currPos = s0;
						s0 = peg$FAILED;
					}
				} else {
					peg$currPos = s0;
					s0 = peg$FAILED;
				}

				return s0;
			}

			function peg$parseInlineAMPscript() {
				var s0, s1, s2, s3;

				s0 = peg$currPos;
				if (peg$c11.test(input.charAt(peg$currPos))) {
					s1 = input.charAt(peg$currPos);
					peg$currPos++;
				} else {
					s1 = peg$FAILED;
					if (peg$silentFails === 0) {
						peg$fail(peg$c12);
					}
				}
				if (s1 !== peg$FAILED) {
					s2 = [];
					s3 = peg$parsews();
					while (s3 !== peg$FAILED) {
						s2.push(s3);
						s3 = peg$parsews();
					}
					if (s2 !== peg$FAILED) {
						peg$savedPos = s0;
						s1 = peg$c8(s1);
						s0 = s1;
					} else {
						peg$currPos = s0;
						s0 = peg$FAILED;
					}
				} else {
					peg$currPos = s0;
					s0 = peg$FAILED;
				}

				return s0;
			}

			function peg$parseInlineAMPscriptStart() {
				var s0, s1, s2, s3;

				s0 = peg$currPos;
				if (input.substr(peg$currPos, 3) === peg$c13) {
					s1 = peg$c13;
					peg$currPos += 3;
				} else {
					s1 = peg$FAILED;
					if (peg$silentFails === 0) {
						peg$fail(peg$c14);
					}
				}
				if (s1 !== peg$FAILED) {
					s2 = [];
					s3 = peg$parsews();
					while (s3 !== peg$FAILED) {
						s2.push(s3);
						s3 = peg$parsews();
					}
					if (s2 !== peg$FAILED) {
						peg$savedPos = s0;
						s1 = peg$c8(s1);
						s0 = s1;
					} else {
						peg$currPos = s0;
						s0 = peg$FAILED;
					}
				} else {
					peg$currPos = s0;
					s0 = peg$FAILED;
				}

				return s0;
			}

			function peg$parseInlineAMPscriptEnd() {
				var s0, s1, s2, s3;

				s0 = peg$currPos;
				if (input.substr(peg$currPos, 3) === peg$c15) {
					s1 = peg$c15;
					peg$currPos += 3;
				} else {
					s1 = peg$FAILED;
					if (peg$silentFails === 0) {
						peg$fail(peg$c16);
					}
				}
				if (s1 !== peg$FAILED) {
					s2 = [];
					s3 = peg$parsews();
					while (s3 !== peg$FAILED) {
						s2.push(s3);
						s3 = peg$parsews();
					}
					if (s2 !== peg$FAILED) {
						peg$savedPos = s0;
						s1 = peg$c8(s1);
						s0 = s1;
					} else {
						peg$currPos = s0;
						s0 = peg$FAILED;
					}
				} else {
					peg$currPos = s0;
					s0 = peg$FAILED;
				}

				return s0;
			}

			function peg$parseCode() {
				var s0, s1, s2, s3;

				s0 = peg$currPos;
				s1 = [];
				if (peg$c17.test(input.charAt(peg$currPos))) {
					s2 = input.charAt(peg$currPos);
					peg$currPos++;
				} else {
					s2 = peg$FAILED;
					if (peg$silentFails === 0) {
						peg$fail(peg$c18);
					}
				}
				if (s2 !== peg$FAILED) {
					while (s2 !== peg$FAILED) {
						s1.push(s2);
						if (peg$c17.test(input.charAt(peg$currPos))) {
							s2 = input.charAt(peg$currPos);
							peg$currPos++;
						} else {
							s2 = peg$FAILED;
							if (peg$silentFails === 0) {
								peg$fail(peg$c18);
							}
						}
					}
				} else {
					s1 = peg$FAILED;
				}
				if (s1 !== peg$FAILED) {
					s2 = [];
					s3 = peg$parsews();
					while (s3 !== peg$FAILED) {
						s2.push(s3);
						s3 = peg$parsews();
					}
					if (s2 !== peg$FAILED) {
						peg$savedPos = s0;
						s1 = peg$c19(s1);
						s0 = s1;
					} else {
						peg$currPos = s0;
						s0 = peg$FAILED;
					}
				} else {
					peg$currPos = s0;
					s0 = peg$FAILED;
				}

				return s0;
			}

			function peg$parseQuotes() {
				var s0, s1, s2, s3, s4;

				s0 = peg$currPos;
				s1 = [];
				s2 = peg$parsews();
				while (s2 !== peg$FAILED) {
					s1.push(s2);
					s2 = peg$parsews();
				}
				if (s1 !== peg$FAILED) {
					if (input.charCodeAt(peg$currPos) === 34) {
						s2 = peg$c20;
						peg$currPos++;
					} else {
						s2 = peg$FAILED;
						if (peg$silentFails === 0) {
							peg$fail(peg$c21);
						}
					}
					if (s2 !== peg$FAILED) {
						s3 = [];
						s4 = peg$parsews();
						while (s4 !== peg$FAILED) {
							s3.push(s4);
							s4 = peg$parsews();
						}
						if (s3 !== peg$FAILED) {
							peg$savedPos = s0;
							s1 = peg$c22(s1);
							s0 = s1;
						} else {
							peg$currPos = s0;
							s0 = peg$FAILED;
						}
					} else {
						peg$currPos = s0;
						s0 = peg$FAILED;
					}
				} else {
					peg$currPos = s0;
					s0 = peg$FAILED;
				}

				return s0;
			}

			function peg$parseLinebreak() {
				var s0, s1;

				s0 = peg$currPos;
				if (peg$c23.test(input.charAt(peg$currPos))) {
					s1 = input.charAt(peg$currPos);
					peg$currPos++;
				} else {
					s1 = peg$FAILED;
					if (peg$silentFails === 0) {
						peg$fail(peg$c24);
					}
				}
				if (s1 !== peg$FAILED) {
					peg$savedPos = s0;
					s1 = peg$c25(s1);
				}
				s0 = s1;

				return s0;
			}

			function peg$parseIndent() {
				var s0, s1, s2, s3;

				s0 = peg$currPos;
				if (peg$c26.test(input.charAt(peg$currPos))) {
					s1 = input.charAt(peg$currPos);
					peg$currPos++;
				} else {
					s1 = peg$FAILED;
					if (peg$silentFails === 0) {
						peg$fail(peg$c27);
					}
				}
				if (s1 !== peg$FAILED) {
					s2 = [];
					s3 = peg$parsews();
					while (s3 !== peg$FAILED) {
						s2.push(s3);
						s3 = peg$parsews();
					}
					if (s2 !== peg$FAILED) {
						peg$savedPos = s0;
						s1 = peg$c28(s1);
						s0 = s1;
					} else {
						peg$currPos = s0;
						s0 = peg$FAILED;
					}
				} else {
					peg$currPos = s0;
					s0 = peg$FAILED;
				}

				return s0;
			}

			function peg$parseSpaces2() {
				var s0, s1;

				s0 = peg$currPos;
				if (input.substr(peg$currPos, 2) === peg$c29) {
					s1 = peg$c29;
					peg$currPos += 2;
				} else {
					s1 = peg$FAILED;
					if (peg$silentFails === 0) {
						peg$fail(peg$c30);
					}
				}
				if (s1 !== peg$FAILED) {
					peg$savedPos = s0;
					s1 = peg$c28(s1);
				}
				s0 = s1;

				return s0;
			}

			function peg$parseSpaces3() {
				var s0, s1;

				s0 = peg$currPos;
				if (input.substr(peg$currPos, 3) === peg$c31) {
					s1 = peg$c31;
					peg$currPos += 3;
				} else {
					s1 = peg$FAILED;
					if (peg$silentFails === 0) {
						peg$fail(peg$c32);
					}
				}
				if (s1 !== peg$FAILED) {
					peg$savedPos = s0;
					s1 = peg$c28(s1);
				}
				s0 = s1;

				return s0;
			}

			function peg$parseSpaces4() {
				var s0, s1;

				s0 = peg$currPos;
				if (input.substr(peg$currPos, 4) === peg$c33) {
					s1 = peg$c33;
					peg$currPos += 4;
				} else {
					s1 = peg$FAILED;
					if (peg$silentFails === 0) {
						peg$fail(peg$c34);
					}
				}
				if (s1 !== peg$FAILED) {
					peg$savedPos = s0;
					s1 = peg$c28(s1);
				}
				s0 = s1;

				return s0;
			}

			function peg$parseSpaces5() {
				var s0, s1;

				s0 = peg$currPos;
				if (input.substr(peg$currPos, 5) === peg$c35) {
					s1 = peg$c35;
					peg$currPos += 5;
				} else {
					s1 = peg$FAILED;
					if (peg$silentFails === 0) {
						peg$fail(peg$c36);
					}
				}
				if (s1 !== peg$FAILED) {
					peg$savedPos = s0;
					s1 = peg$c28(s1);
				}
				s0 = s1;

				return s0;
			}

			function peg$parseSpaces6() {
				var s0, s1;

				s0 = peg$currPos;
				if (input.substr(peg$currPos, 6) === peg$c37) {
					s1 = peg$c37;
					peg$currPos += 6;
				} else {
					s1 = peg$FAILED;
					if (peg$silentFails === 0) {
						peg$fail(peg$c38);
					}
				}
				if (s1 !== peg$FAILED) {
					peg$savedPos = s0;
					s1 = peg$c28(s1);
				}
				s0 = s1;

				return s0;
			}

			function peg$parseSpaces7() {
				var s0, s1;

				s0 = peg$currPos;
				if (input.substr(peg$currPos, 7) === peg$c39) {
					s1 = peg$c39;
					peg$currPos += 7;
				} else {
					s1 = peg$FAILED;
					if (peg$silentFails === 0) {
						peg$fail(peg$c40);
					}
				}
				if (s1 !== peg$FAILED) {
					peg$savedPos = s0;
					s1 = peg$c28(s1);
				}
				s0 = s1;

				return s0;
			}

			function peg$parseSpaces8() {
				var s0, s1;

				s0 = peg$currPos;
				if (input.substr(peg$currPos, 8) === peg$c41) {
					s1 = peg$c41;
					peg$currPos += 8;
				} else {
					s1 = peg$FAILED;
					if (peg$silentFails === 0) {
						peg$fail(peg$c42);
					}
				}
				if (s1 !== peg$FAILED) {
					peg$savedPos = s0;
					s1 = peg$c28(s1);
				}
				s0 = s1;

				return s0;
			}

			function peg$parseSpaces9() {
				var s0, s1;

				s0 = peg$currPos;
				if (input.substr(peg$currPos, 9) === peg$c43) {
					s1 = peg$c43;
					peg$currPos += 9;
				} else {
					s1 = peg$FAILED;
					if (peg$silentFails === 0) {
						peg$fail(peg$c44);
					}
				}
				if (s1 !== peg$FAILED) {
					peg$savedPos = s0;
					s1 = peg$c28(s1);
				}
				s0 = s1;

				return s0;
			}

			function peg$parseSpaces10() {
				var s0, s1;

				s0 = peg$currPos;
				if (input.substr(peg$currPos, 9) === peg$c43) {
					s1 = peg$c43;
					peg$currPos += 9;
				} else {
					s1 = peg$FAILED;
					if (peg$silentFails === 0) {
						peg$fail(peg$c44);
					}
				}
				if (s1 !== peg$FAILED) {
					peg$savedPos = s0;
					s1 = peg$c28(s1);
				}
				s0 = s1;

				return s0;
			}

			function peg$parseSpaces11() {
				var s0, s1;

				s0 = peg$currPos;
				if (input.substr(peg$currPos, 10) === peg$c45) {
					s1 = peg$c45;
					peg$currPos += 10;
				} else {
					s1 = peg$FAILED;
					if (peg$silentFails === 0) {
						peg$fail(peg$c46);
					}
				}
				if (s1 !== peg$FAILED) {
					peg$savedPos = s0;
					s1 = peg$c28(s1);
				}
				s0 = s1;

				return s0;
			}

			function peg$parseSpaces12() {
				var s0, s1;

				s0 = peg$currPos;
				if (input.substr(peg$currPos, 11) === peg$c47) {
					s1 = peg$c47;
					peg$currPos += 11;
				} else {
					s1 = peg$FAILED;
					if (peg$silentFails === 0) {
						peg$fail(peg$c48);
					}
				}
				if (s1 !== peg$FAILED) {
					peg$savedPos = s0;
					s1 = peg$c28(s1);
				}
				s0 = s1;

				return s0;
			}

			function peg$parseSpaces13() {
				var s0, s1;

				s0 = peg$currPos;
				if (input.substr(peg$currPos, 12) === peg$c49) {
					s1 = peg$c49;
					peg$currPos += 12;
				} else {
					s1 = peg$FAILED;
					if (peg$silentFails === 0) {
						peg$fail(peg$c50);
					}
				}
				if (s1 !== peg$FAILED) {
					peg$savedPos = s0;
					s1 = peg$c28(s1);
				}
				s0 = s1;

				return s0;
			}

			function peg$parseSpaces14() {
				var s0, s1;

				s0 = peg$currPos;
				if (input.substr(peg$currPos, 13) === peg$c51) {
					s1 = peg$c51;
					peg$currPos += 13;
				} else {
					s1 = peg$FAILED;
					if (peg$silentFails === 0) {
						peg$fail(peg$c52);
					}
				}
				if (s1 !== peg$FAILED) {
					peg$savedPos = s0;
					s1 = peg$c28(s1);
				}
				s0 = s1;

				return s0;
			}

			function peg$parseSpaces15() {
				var s0, s1;

				s0 = peg$currPos;
				if (input.substr(peg$currPos, 14) === peg$c53) {
					s1 = peg$c53;
					peg$currPos += 14;
				} else {
					s1 = peg$FAILED;
					if (peg$silentFails === 0) {
						peg$fail(peg$c54);
					}
				}
				if (s1 !== peg$FAILED) {
					peg$savedPos = s0;
					s1 = peg$c28(s1);
				}
				s0 = s1;

				return s0;
			}

			function peg$parseSpaces16() {
				var s0, s1;

				s0 = peg$currPos;
				if (input.substr(peg$currPos, 15) === peg$c55) {
					s1 = peg$c55;
					peg$currPos += 15;
				} else {
					s1 = peg$FAILED;
					if (peg$silentFails === 0) {
						peg$fail(peg$c56);
					}
				}
				if (s1 !== peg$FAILED) {
					peg$savedPos = s0;
					s1 = peg$c28(s1);
				}
				s0 = s1;

				return s0;
			}

			function peg$parseSpaces17() {
				var s0, s1;

				s0 = peg$currPos;
				if (input.substr(peg$currPos, 16) === peg$c57) {
					s1 = peg$c57;
					peg$currPos += 16;
				} else {
					s1 = peg$FAILED;
					if (peg$silentFails === 0) {
						peg$fail(peg$c58);
					}
				}
				if (s1 !== peg$FAILED) {
					peg$savedPos = s0;
					s1 = peg$c28(s1);
				}
				s0 = s1;

				return s0;
			}

			function peg$parseSpaces18() {
				var s0, s1;

				s0 = peg$currPos;
				if (input.substr(peg$currPos, 17) === peg$c59) {
					s1 = peg$c59;
					peg$currPos += 17;
				} else {
					s1 = peg$FAILED;
					if (peg$silentFails === 0) {
						peg$fail(peg$c60);
					}
				}
				if (s1 !== peg$FAILED) {
					peg$savedPos = s0;
					s1 = peg$c28(s1);
				}
				s0 = s1;

				return s0;
			}

			function peg$parseSpaces19() {
				var s0, s1;

				s0 = peg$currPos;
				if (input.substr(peg$currPos, 18) === peg$c61) {
					s1 = peg$c61;
					peg$currPos += 18;
				} else {
					s1 = peg$FAILED;
					if (peg$silentFails === 0) {
						peg$fail(peg$c62);
					}
				}
				if (s1 !== peg$FAILED) {
					peg$savedPos = s0;
					s1 = peg$c28(s1);
				}
				s0 = s1;

				return s0;
			}

			function peg$parseSpaces20() {
				var s0, s1;

				s0 = peg$currPos;
				if (input.substr(peg$currPos, 19) === peg$c63) {
					s1 = peg$c63;
					peg$currPos += 19;
				} else {
					s1 = peg$FAILED;
					if (peg$silentFails === 0) {
						peg$fail(peg$c64);
					}
				}
				if (s1 !== peg$FAILED) {
					peg$savedPos = s0;
					s1 = peg$c28(s1);
				}
				s0 = s1;

				return s0;
			}

			function peg$parseSpaces21() {
				var s0, s1;

				s0 = peg$currPos;
				if (input.substr(peg$currPos, 20) === peg$c65) {
					s1 = peg$c65;
					peg$currPos += 20;
				} else {
					s1 = peg$FAILED;
					if (peg$silentFails === 0) {
						peg$fail(peg$c66);
					}
				}
				if (s1 !== peg$FAILED) {
					peg$savedPos = s0;
					s1 = peg$c28(s1);
				}
				s0 = s1;

				return s0;
			}

			function peg$parseSpaces22() {
				var s0, s1;

				s0 = peg$currPos;
				if (input.substr(peg$currPos, 21) === peg$c67) {
					s1 = peg$c67;
					peg$currPos += 21;
				} else {
					s1 = peg$FAILED;
					if (peg$silentFails === 0) {
						peg$fail(peg$c68);
					}
				}
				if (s1 !== peg$FAILED) {
					peg$savedPos = s0;
					s1 = peg$c28(s1);
				}
				s0 = s1;

				return s0;
			}

			function peg$parseSpaces23() {
				var s0, s1;

				s0 = peg$currPos;
				if (input.substr(peg$currPos, 22) === peg$c69) {
					s1 = peg$c69;
					peg$currPos += 22;
				} else {
					s1 = peg$FAILED;
					if (peg$silentFails === 0) {
						peg$fail(peg$c70);
					}
				}
				if (s1 !== peg$FAILED) {
					peg$savedPos = s0;
					s1 = peg$c28(s1);
				}
				s0 = s1;

				return s0;
			}

			function peg$parseSpaces24() {
				var s0, s1;

				s0 = peg$currPos;
				if (input.substr(peg$currPos, 23) === peg$c71) {
					s1 = peg$c71;
					peg$currPos += 23;
				} else {
					s1 = peg$FAILED;
					if (peg$silentFails === 0) {
						peg$fail(peg$c72);
					}
				}
				if (s1 !== peg$FAILED) {
					peg$savedPos = s0;
					s1 = peg$c28(s1);
				}
				s0 = s1;

				return s0;
			}

			function peg$parseSpaces25() {
				var s0, s1;

				s0 = peg$currPos;
				if (input.substr(peg$currPos, 24) === peg$c73) {
					s1 = peg$c73;
					peg$currPos += 24;
				} else {
					s1 = peg$FAILED;
					if (peg$silentFails === 0) {
						peg$fail(peg$c74);
					}
				}
				if (s1 !== peg$FAILED) {
					peg$savedPos = s0;
					s1 = peg$c28(s1);
				}
				s0 = s1;

				return s0;
			}

			function peg$parseSpaces26() {
				var s0, s1;

				s0 = peg$currPos;
				if (input.substr(peg$currPos, 25) === peg$c75) {
					s1 = peg$c75;
					peg$currPos += 25;
				} else {
					s1 = peg$FAILED;
					if (peg$silentFails === 0) {
						peg$fail(peg$c76);
					}
				}
				if (s1 !== peg$FAILED) {
					peg$savedPos = s0;
					s1 = peg$c28(s1);
				}
				s0 = s1;

				return s0;
			}

			function peg$parseSpaces27() {
				var s0, s1;

				s0 = peg$currPos;
				if (input.substr(peg$currPos, 26) === peg$c77) {
					s1 = peg$c77;
					peg$currPos += 26;
				} else {
					s1 = peg$FAILED;
					if (peg$silentFails === 0) {
						peg$fail(peg$c78);
					}
				}
				if (s1 !== peg$FAILED) {
					peg$savedPos = s0;
					s1 = peg$c28(s1);
				}
				s0 = s1;

				return s0;
			}

			function peg$parseSpaces28() {
				var s0, s1;

				s0 = peg$currPos;
				if (input.substr(peg$currPos, 27) === peg$c79) {
					s1 = peg$c79;
					peg$currPos += 27;
				} else {
					s1 = peg$FAILED;
					if (peg$silentFails === 0) {
						peg$fail(peg$c80);
					}
				}
				if (s1 !== peg$FAILED) {
					peg$savedPos = s0;
					s1 = peg$c28(s1);
				}
				s0 = s1;

				return s0;
			}

			function peg$parseSpaces29() {
				var s0, s1;

				s0 = peg$currPos;
				if (input.substr(peg$currPos, 28) === peg$c81) {
					s1 = peg$c81;
					peg$currPos += 28;
				} else {
					s1 = peg$FAILED;
					if (peg$silentFails === 0) {
						peg$fail(peg$c82);
					}
				}
				if (s1 !== peg$FAILED) {
					peg$savedPos = s0;
					s1 = peg$c28(s1);
				}
				s0 = s1;

				return s0;
			}

			function peg$parseSpaces30() {
				var s0, s1;

				s0 = peg$currPos;
				if (input.substr(peg$currPos, 29) === peg$c83) {
					s1 = peg$c83;
					peg$currPos += 29;
				} else {
					s1 = peg$FAILED;
					if (peg$silentFails === 0) {
						peg$fail(peg$c84);
					}
				}
				if (s1 !== peg$FAILED) {
					peg$savedPos = s0;
					s1 = peg$c28(s1);
				}
				s0 = s1;

				return s0;
			}

			function peg$parsews() {
				var s0, s1;

				peg$silentFails++;
				if (peg$c86.test(input.charAt(peg$currPos))) {
					s0 = input.charAt(peg$currPos);
					peg$currPos++;
				} else {
					s0 = peg$FAILED;
					if (peg$silentFails === 0) {
						peg$fail(peg$c87);
					}
				}
				peg$silentFails--;
				if (s0 === peg$FAILED) {
					s1 = peg$FAILED;
					if (peg$silentFails === 0) {
						peg$fail(peg$c85);
					}
				}

				return s0;
			}

			peg$result = peg$startRuleFunction();

			if (peg$result !== peg$FAILED && peg$currPos === input.length) {
				return peg$result;
			} else {
				if (peg$result !== peg$FAILED && peg$currPos < input.length) {
					peg$fail(peg$endExpectation());
				}

				throw peg$buildStructuredError(
					peg$maxFailExpected,
					peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
					peg$maxFailPos < input.length ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1) : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
				);
			}
		}

		return {
			SyntaxError: peg$SyntaxError,
			parse: peg$parse(text)
		};
	}
	
	exports.parse = parse;

});