import { Tag, Divider, Row, Col, Spin, Tooltip } from 'antd';
import { useState } from 'react';

export default function AnalyticSummaryCard({
  title,
  tagContents = [],
  tagColor,
  prefix,
  isLoading = false,
}) {
  const [shownSubProduct, setShownSubProduct] = useState(new Set());
  if (isLoading) return <Spin />;

  function subProdcutViewToggle(idx) {
    const updatedShownSubProduct = new Set(shownSubProduct);
    if (updatedShownSubProduct.has(idx)) updatedShownSubProduct.delete(idx);
    else updatedShownSubProduct.add(idx);
    setShownSubProduct(updatedShownSubProduct);
  }

  return (
    <Col
      className="gutter-row"
      xs={{ span: 24 }}
      sm={{ span: 12 }}
      md={{ span: 12 }}
      lg={{ span: 7 }}
    >
      <div
        className="whiteBox shadow"
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
          {tagContents.map((tagContent, idx) => {
            let totalItem = 0;
            tagContent.subProducts.map((sp) => (totalItem += sp.total));

            return (
              <div key={idx}>
                <Row
                  gutter={[0, 0]}
                  justify="space-between"
                  wrap={false}
                  className="item"
                  onClick={() => subProdcutViewToggle(idx)}
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
                        {totalItem ? totalItem : '0'}
                      </Tag>
                    </Tooltip>
                  </Col>
                </Row>

                {shownSubProduct.has(idx) ? (
                  <div key={idx} style={{ margin: '0.5rem 1.5rem' }} className="transition-all">
                    {tagContent.subProducts.map((tsp) => (
                      <Row
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
                        <Tag
                          style={{
                            justifyContent: 'center',
                            maxWidth: '110px',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {tsp.total || '0'}
                        </Tag>
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
