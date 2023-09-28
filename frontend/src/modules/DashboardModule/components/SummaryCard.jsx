import { Tag, Divider, Row, Col, Spin, Tooltip } from 'antd';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

export default function AnalyticSummaryCard({
  title,
  tagContents = [],
  tagColor,
  prefix,
  url,
  isLoading = false,
}) {
  const [shownSubProduct, setShownSubProduct] = useState(new Set());
  const history = useHistory();

  if (isLoading) return <Spin />;

  function subProdcutViewToggle(e, idx) {
    e.stopPropagation();
    const updatedShownSubProduct = new Set(shownSubProduct);
    if (updatedShownSubProduct.has(idx)) updatedShownSubProduct.delete(idx);
    else updatedShownSubProduct.add(idx);
    setShownSubProduct(updatedShownSubProduct);
  }

  function getTagColor(value) {
    // if (value < 25) return '#bfbfbf';
    // else if (value < 50) return '#fffb8f';
    // else if (value < 75) return '#ffe58f';
    // else if (value <= 100) return '#f6ffed';
    if (value < 25) return 'red';
    else if (value < 50) return 'yellow';
    else if (value < 75) return 'orange';
    else if (value <= 100) return 'green';
  }

  return (
    <Col
      className="gutter-row"
      xs={{ span: 24 }}
      sm={{ span: 12 }}
      md={{ span: 12 }}
      lg={{ span: 7 }}
      style={{ margin: '0 auto' }}
      onClick={(e) => {
        e.stopPropagation();
        history.push(url);
      }}
    >
      <div
        className="whiteBox shadow pointer"
        style={{ color: '#595959', fontSize: 13, minHeight: '106px', height: '100%' }}
      >
        <div className="pad15 strong" style={{ textAlign: 'center', justifyContent: 'center' }}>
          <h3 style={{ color: '#22075e', marginBottom: 0, textTransform: 'capitalize' }}>
            {title}
          </h3>
        </div>
        <Divider style={{ padding: 0, margin: 0 }}></Divider>
        <div className="" style={{ padding: '15px 0' }}>
          {!tagContents || !tagContents.length ? (
            <div className="pad15 strong" style={{ textAlign: 'center', justifyContent: 'center' }}>
              <h5 style={{ color: '#22075e', marginBottom: 0, textTransform: 'capitalize' }}>
                No Data
              </h5>
            </div>
          ) : (
            ''
          )}
          {tagContents
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((tagContent, idx) => {
              let totalItem = 0;
              tagContent.subProducts.map((sp) => (totalItem += sp.total));

              return (
                <div key={idx}>
                  <Row
                    gutter={[0, 0]}
                    justify="space-between"
                    wrap={false}
                    className="item"
                    onClick={(e) => subProdcutViewToggle(e, idx)}
                  >
                    <Col className="gutter-row" flex="70px" style={{ textAlign: 'left' }}>
                      <div className="left" style={{ whiteSpace: 'nowrap' }}>
                        {tagContent.name}
                      </div>
                    </Col>
                    <Divider
                      style={{
                        height: '100%',
                        padding: '10px 0',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      type="vertical"
                    ></Divider>
                    <Col
                      className="gutter-row"
                      flex="auto"
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                      }}
                    >
                      <Tooltip title={tagContent.name}>
                        <Tag
                          color={totalItem !== 0 ? tagColor : '#bfbfbf'}
                          style={{
                            justifyContent: 'center',
                            maxWidth: '110px',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {totalItem ? totalItem : '0'} {tagContent.unit}
                        </Tag>
                      </Tooltip>
                    </Col>
                  </Row>

                  {shownSubProduct.has(idx) ? (
                    <div key={idx} style={{ margin: '0.5rem 1.5rem' }} className="transition-all">
                      {tagContent.subProducts
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((tsp, jdx) => (
                          <Row
                            key={jdx}
                            gutter={[0, 0]}
                            justify="space-between"
                            wrap={false}
                            style={{ margin: '4px 0' }}
                          >
                            <Col className="gutter-row" flex="70px" style={{ textAlign: 'left' }}>
                              <div className="left" style={{ whiteSpace: 'nowrap' }}>
                                {tsp.name}
                              </div>
                            </Col>
                            <div>
                              <Tag
                                style={{
                                  justifyContent: 'center',
                                  maxWidth: '110px',
                                  overflow: 'hidden',
                                  whiteSpace: 'nowrap',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {tsp.total || '0'} {tsp.unit}
                              </Tag>
                              <Tag
                                color={getTagColor((100 * tsp.total) / totalItem)}
                                style={{
                                  justifyContent: 'center',
                                  maxWidth: '110px',
                                  overflow: 'hidden',
                                  whiteSpace: 'nowrap',
                                  textOverflow: 'ellipsis',
                                  // backgroundColor: getTagColor((100 * tsp.total) / totalItem),
                                }}
                              >
                                {((100 * tsp.total) / totalItem).toFixed(1)}%
                              </Tag>
                            </div>
                          </Row>
                        ))}
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </Col>
  );
}
